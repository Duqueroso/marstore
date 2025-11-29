import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import dbConnection from "@/lib/dbConnection"
import Users from "@/database/models/users"
import { verifyPassword } from "@/lib/auth-utils"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      async profile(profile) {
        await dbConnection();
        
        // Buscar o crear usuario de Google
        let user = await Users.findOne({ email: profile.email });
        
        if (!user) {
          // Generar documento único para usuario de Google
          const googleDocumento = `G${profile.sub.slice(0, 10)}`;
          user = await Users.create({
            email: profile.email,
            name: profile.name,
            documento: googleDocumento,
            provider: 'google',
            image: profile.picture,
            emailVerified: new Date(),
          });
        }
        
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
          documento: user.documento,
          provider: 'google',
          rol: user.rol,
        };
      },
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        documento: { label: "Número de Documento", type: "text" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.documento || !credentials?.password) {
            console.log('❌ Credenciales faltantes');
            return null;
          }

          await dbConnection();

          const user = await Users.findOne({ documento: credentials.documento as string });

          if (!user) {
            console.log('❌ Usuario no encontrado:', credentials.documento);
            return null;
          }

          if (!user.password) {
            console.log('❌ Usuario sin contraseña (posiblemente de Google):', user.email);
            return null;
          }

          console.log('🔍 Verificando contraseña para:', user.email);
          const isValid = await verifyPassword(
            credentials.password as string,
            user.password
          );

          if (!isValid) {
            console.log('❌ Contraseña incorrecta para:', user.email);
            return null;
          }

          console.log('✅ Login exitoso:', user.email);
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image,
            documento: user.documento,
            provider: 'credentials',
            rol: user.rol,
          };
        } catch (error) {
          console.error('❌ Error en autorización:', error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.documento = user.documento;
        token.provider = user.provider || 'credentials';
        token.rol = user.rol || 'user';
      }
      
      // Log para debugging
      if (trigger === 'signIn') {
        console.log('🔐 JWT Token creado para:', user?.email);
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.documento = token.documento as string;
        session.user.provider = token.provider as string;
        session.user.rol = token.rol as string;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
})
