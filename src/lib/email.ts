import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true', // true para 465, false para otros puertos
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendThankYouEmail(to: string, name: string) {
  const mailOptions = {
    from: `"Mar Store" <${process.env.EMAIL_USER}>`,
    to,
    subject: '¡Gracias por contactarnos! - Mar Store',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #540863 0%, #92487A 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #e0e0e0; }
            .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #540863; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .highlight { color: #540863; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>¡Gracias por contactarnos!</h1>
            </div>
            <div class="content">
              <p>Hola <span class="highlight">${name}</span>,</p>
              
              <p>Hemos recibido tu mensaje y queremos agradecerte por ponerte en contacto con <strong>Mar Store</strong>.</p>
              
              <p>Nuestro equipo revisará tu mensaje y te responderemos lo antes posible, generalmente en un plazo de 24 a 48 horas.</p>
              
              <p>Mientras tanto, te invitamos a:</p>
              <ul>
                <li>Explorar nuestro catálogo de productos</li>
                <li>Conocer nuestras últimas ofertas</li>
                <li>Seguirnos en redes sociales</li>
              </ul>
              
              <center>
                <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}" class="button">Visitar Tienda</a>
              </center>
              
              <p>Si tienes alguna pregunta urgente, no dudes en responder a este correo.</p>
              
              <p>Saludos cordiales,<br>
              <strong>El equipo de Mar Store</strong></p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Mar Store. Todos los derechos reservados.</p>
              <p>Tu destino de moda y estilo</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      ¡Gracias por contactarnos!
      
      Hola ${name},
      
      Hemos recibido tu mensaje y queremos agradecerte por ponerte en contacto con Mar Store.
      
      Nuestro equipo revisará tu mensaje y te responderemos lo antes posible, generalmente en un plazo de 24 a 48 horas.
      
      Si tienes alguna pregunta urgente, no dudes en responder a este correo.
      
      Saludos cordiales,
      El equipo de Mar Store
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error al enviar correo:', error);
    throw error;
  }
}

export async function sendContactNotification(contactData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const mailOptions = {
    from: `"Mar Store - Contacto" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, // El correo del administrador
    subject: `Nuevo mensaje de contacto: ${contactData.subject}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
            .header { background: #540863; color: white; padding: 20px; text-align: center; }
            .content { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
            .field { margin: 10px 0; }
            .label { font-weight: bold; color: #540863; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Nuevo Mensaje de Contacto</h2>
            </div>
            <div class="content">
              <div class="field">
                <span class="label">Nombre:</span> ${contactData.name}
              </div>
              <div class="field">
                <span class="label">Email:</span> ${contactData.email}
              </div>
              <div class="field">
                <span class="label">Asunto:</span> ${contactData.subject}
              </div>
              <div class="field">
                <span class="label">Mensaje:</span>
                <p>${contactData.message.replace(/\n/g, '<br>')}</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Notificación enviada:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error al enviar notificación:', error);
    throw error;
  }
}

export default transporter;
