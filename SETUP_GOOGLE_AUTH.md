# Mar Store - Configuración de Google OAuth

Para configurar Google OAuth y hacer funcionar el login con Google, sigue estos pasos:

## 1. Crear proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. En el menú lateral, ve a "APIs y servicios" > "Credenciales"

## 2. Configurar pantalla de consentimiento OAuth

1. Click en "Pantalla de consentimiento de OAuth"
2. Selecciona "Externo" si es una aplicación pública
3. Completa la información requerida:
   - Nombre de la aplicación: **Mar Store**
   - Correo de soporte
   - Logo (opcional)
4. Guarda y continúa

## 3. Crear credenciales OAuth 2.0

1. Ve a "Credenciales" > "Crear credenciales" > "ID de cliente de OAuth"
2. Tipo de aplicación: **Aplicación web**
3. Nombre: **Mar Store - Web Client**
4. Orígenes de JavaScript autorizados:
   ```
   http://localhost:3000
   ```
5. URIs de redireccionamiento autorizados:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
6. Click en "Crear"

## 4. Copiar credenciales al .env.local

Después de crear las credenciales, copia:
- **ID de cliente**: Cópialo en `GOOGLE_CLIENT_ID`
- **Secreto del cliente**: Cópialo en `GOOGLE_CLIENT_SECRET`

Tu archivo `.env.local` debería verse así:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-secreto-generado-aqui

GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwx
```

## 5. Generar NEXTAUTH_SECRET

Ejecuta en tu terminal:

```bash
openssl rand -base64 32
```

Copia el resultado en la variable `NEXTAUTH_SECRET` de tu `.env.local`

## 6. Reiniciar el servidor de desarrollo

```bash
npm run dev
```

## 7. Probar el login

1. Ve a `http://localhost:3000`
2. Click en "Iniciar con Google" en el Navbar
3. Selecciona tu cuenta de Google
4. ¡Listo! Deberías estar autenticado

## Notas importantes

- **Producción**: Cuando despliegues a producción, agrega los dominios de producción en Google Cloud Console
- **Seguridad**: Nunca compartas tus credenciales ni las subas a Git
- El archivo `.env.local` ya está en `.gitignore` por defecto
