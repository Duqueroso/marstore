# Guía de Configuración de Email

Esta guía te ayudará a configurar la funcionalidad de email para el formulario de contacto en Mar Store.

## Resumen

El formulario de contacto envía dos correos electrónicos:
1. **Email de Agradecimiento** - Enviado al usuario que envió el formulario
2. **Email de Notificación** - Enviado al administrador (tú) con los detalles del contacto

## Prerrequisitos

Necesitas una cuenta de correo con acceso SMTP. Recomendamos usar:
- Gmail (más fácil con Contraseñas de Aplicación)
- Outlook/Hotmail
- Servidor SMTP personalizado

---

## Opción 1: Gmail (Recomendado)

### Paso 1: Habilitar Autenticación de 2 Factores

1. Ve a tu Cuenta de Google: https://myaccount.google.com/
2. Haz clic en **Seguridad** en el menú izquierdo
3. En "Cómo accedes a Google", habilita la **Verificación en dos pasos**
4. Sigue el proceso de configuración

### Paso 2: Generar Contraseña de Aplicación

1. Ve a: https://myaccount.google.com/apppasswords
2. Selecciona **Correo** como la aplicación
3. Selecciona **Otro** como el dispositivo y nómbralo "Mar Store"
4. Haz clic en **Generar**
5. Copia la contraseña de 16 caracteres (elimina los espacios)

### Paso 3: Actualizar .env.local

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=tu-gmail@gmail.com
EMAIL_PASSWORD=tu-contraseña-de-16-caracteres
```

---

## Opción 2: Outlook/Hotmail

### Paso 1: Habilitar Acceso SMTP

Outlook permite acceso SMTP por defecto.

### Paso 2: Actualizar .env.local

```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=tu-correo@outlook.com
EMAIL_PASSWORD=tu-contraseña-outlook
```

---

## Opción 3: Servidor SMTP Personalizado

Si tienes tu propio servidor SMTP o usas un servicio como SendGrid, Mailgun, etc.:

```env
EMAIL_HOST=tu-servidor-smtp.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=tu-usuario
EMAIL_PASSWORD=tu-contraseña
```

**Nota:** 
- Usa `EMAIL_PORT=465` y `EMAIL_SECURE=true` si tu servidor SMTP requiere SSL
- Usa `EMAIL_PORT=587` y `EMAIL_SECURE=false` para TLS/STARTTLS

---

## Probar la Configuración

1. Actualiza tu archivo `.env.local` con las credenciales anteriores
2. Reinicia tu servidor de desarrollo:
   ```bash
   npm run dev
   ```
3. Navega a: http://localhost:3000/es/contact
4. Completa y envía el formulario de contacto
5. Verifica ambos:
   - El email que ingresaste en el formulario (debe recibir el email de agradecimiento)
   - Tu bandeja de entrada EMAIL_USER (debe recibir la notificación)

---

## Solución de Problemas

### Error: "Invalid login"
- Verifica tu email y contraseña
- Para Gmail, asegúrate de usar una Contraseña de Aplicación, no tu contraseña regular
- Verifica que 2FA esté habilitado en tu cuenta de Gmail

### Error: "Connection timeout"
- Verifica tu EMAIL_HOST y EMAIL_PORT
- Intenta cambiar EMAIL_SECURE de false a true (o viceversa)
- Verifica que tu firewall no esté bloqueando conexiones SMTP

### Los emails no llegan
- Revisa las carpetas de spam/correo no deseado
- Verifica que EMAIL_USER sea correcto
- Prueba con un proveedor de email diferente

### Error de Gmail "Acceso de apps menos seguras"
- No uses "Apps menos seguras" - usa Contraseñas de Aplicación en su lugar
- Asegúrate de que 2FA esté habilitado antes de crear la Contraseña de Aplicación

---

## Despliegue en Producción

Para producción, considera usar servicios de email dedicados:

- **SendGrid** - Plan gratuito: 100 emails/día
- **Mailgun** - Plan gratuito: 5,000 emails/mes
- **AWS SES** - Muy económico, pago por uso
- **Postmark** - Especialista en emails transaccionales

Estos servicios proporcionan mejor entregabilidad y análisis detallados.

---

## Notas de Seguridad

⚠️ **Importante:**
- Nunca subas tu archivo `.env.local` a Git
- `.env.local` ya está en `.gitignore`
- Usa variables de entorno en producción (Vercel, Railway, etc.)
- Rota las contraseñas periódicamente
- Usa Contraseñas de Aplicación para Gmail, nunca tu contraseña principal

---

## ¿Necesitas Ayuda?

Si sigues teniendo problemas:
1. Revisa los logs del servidor en tu terminal
2. Busca mensajes de error en la consola del navegador
3. Verifica que todas las variables de entorno estén configuradas correctamente
4. Reinicia el servidor de desarrollo después de cambiar .env.local
