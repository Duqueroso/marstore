import { DefaultSession } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      documento: string
      provider: string
      rol: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    name: string
    email: string
    documento: string
    provider?: string
    rol?: string
    image?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string
    documento: string
    provider: string
    rol: string
  }
}
