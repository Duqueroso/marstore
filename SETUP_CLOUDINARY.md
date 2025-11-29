# Configuración de Cloudinary

Para subir imágenes de productos, necesitas configurar Cloudinary.

## Pasos para obtener las credenciales:

1. **Crear una cuenta en Cloudinary:**
   - Ve a https://cloudinary.com/
   - Regístrate gratis o inicia sesión si ya tienes una cuenta

2. **Obtener las credenciales:**
   - Una vez dentro, ve al Dashboard
   - Encontrarás tus credenciales en la sección "Account Details":
     - **Cloud Name**: Tu nombre de cloud (ej: `dxxxxxx`)
     - **API Key**: Tu clave API (ej: `123456789012345`)
     - **API Secret**: Tu secreto API (ej: `aBcDeFgHiJkLmNoPqRsTuVwXyZ`)

3. **Configurar las variables de entorno:**
   - Abre el archivo `.env.local` en la raíz del proyecto
   - Reemplaza los valores de las siguientes variables con tus credenciales:

   ```env
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name_aqui
   CLOUDINARY_API_KEY=tu_api_key_aqui
   CLOUDINARY_API_SECRET=tu_api_secret_aqui
   ```

4. **Reiniciar el servidor de desarrollo:**
   - Detén el servidor (Ctrl+C)
   - Vuelve a ejecutar `npm run dev`

## Características implementadas:

✅ Subida de múltiples imágenes desde el dispositivo
✅ Vista previa de imágenes antes de guardar
✅ Eliminación de imágenes de la lista
✅ Almacenamiento en Cloudinary con carpeta organizada (`marstore/products`)
✅ Solo administradores pueden subir imágenes
✅ Soporte para imágenes en formato JPG, PNG, GIF, etc.

## Uso:

1. Como administrador, ve a la página de Productos
2. Haz clic en "Crear Producto"
3. En el formulario, busca la sección "Imágenes"
4. Haz clic en el área de carga o arrastra imágenes
5. Puedes subir múltiples imágenes a la vez
6. Las imágenes se mostrarán en vista previa
7. Puedes eliminar imágenes haciendo hover y clic en la X roja
8. Al guardar el producto, las URLs de Cloudinary se guardarán en la base de datos

## Límites de Cloudinary (plan gratuito):

- 25 créditos mensuales
- 25GB de almacenamiento
- 25GB de ancho de banda mensual
- 10,000 transformaciones por mes

Esto es más que suficiente para comenzar con tu tienda.
