import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
    constructor(private readonly configService: ConfigService) {
        const sendgridApiKey = this.configService.get<string>('SENDGRID_APIKEY');
        if (!sendgridApiKey) {
            throw new Error('SendGrid API Key no configurada.');
        }
        sgMail.setApiKey(sendgridApiKey);
    }

    async sendEmailVerification(username: string, to: string, code: string): Promise<void> {
        const from = this.configService.get<string>('SENDGRID_FROM') || 'noreply@example.com';
        const codeDigits = code.split('');
        const htmlTemplate = this.getEmailVerificationTemplate(username, codeDigits);

        const msg = {
            to,
            from,
            subject: 'Verificación de Correo Electrónico',
            html: htmlTemplate,
        };

        try {
            await sgMail.send(msg);
            console.log(`Correo de verificación enviado a ${to}`);
        } catch (error) {
            console.error('Error al enviar el correo:', error);
            throw new Error('No se pudo enviar el correo de verificación.');
        }
    }

    private getEmailVerificationTemplate(username: string, codeDigits: string[]): string {
        return `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Confirmación de Correo</title>
    <style>
      /* Estilos base */
      body {
        margin: 0;
        padding: 0;
        background-color: #f4f4f7;
        font-family: Arial, sans-serif;
      }
      table {
        border-spacing: 0;
        border-collapse: collapse;
        width: 100%;
      }
      /* Contenedor principal */
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border: 1px solid #ddd;
        border-radius: 8px;
        overflow: hidden;
      }
      /* Encabezado */
      .header {
        background-color: #4caf50;
        padding: 20px;
        text-align: center;
        color: #ffffff;
        font-size: 24px;
        font-weight: bold;
      }
      /* Contenido */
      .content {
        padding: 20px;
        text-align: center;
        color: #555555;
      }
      .content h2 {
        margin-top: 0;
        font-size: 20px;
      }
      .content p {
        line-height: 1.6;
        margin: 10px 0;
      }
      /* Contenedor del código */
      .code-container {
        display: inline-block;
        margin-top: 20px;
      }
      .digit-box {
        display: inline-block;
        width: 40px;
        height: 40px;
        margin: 5px;
        border-radius: 5px;
        border: 2px solid #4caf50;
        font-size: 24px;
        font-weight: bold;
        color: #4caf50;
        line-height: 40px;
        text-align: center;
        cursor: pointer;
      }
      /* Pie de página */
      .footer {
        padding: 20px;
        text-align: center;
        font-size: 14px;
        color: #777777;
      }
      .footer a {
        color: #4caf50;
        text-decoration: none;
      }
      .footer a:hover {
        text-decoration: underline;
      }
      @media (max-width: 600px) {
        .email-container {
          border-radius: 0;
        }
        .content {
          padding: 15px;
        }
        .digit-box {
          width: 40px;
          height: 40px;
          font-size: 18px;
        }
        .header {
          font-size: 20px;
          padding: 15px;
        }
      }
    </style>
  </head>
  <body>
    <table role="presentation" class="email-container">
      <tr>
        <td>
          <div class="header">
            Confirmación de Correo
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div class="content">
            <h2>Hola, ${username}</h2>
            <p>Gracias por registrarte en <strong>PracticaPro</strong>.</p>
            <p>Utiliza el siguiente código de verificación para confirmar tu correo:</p>
            <div class="code-container">
              ${codeDigits
            .map(
                (digit) => `
                  <div class="digit-box" title="Toca para copiar">${digit}</div>
                `
            )
            .join('')}
            </div>
            <p style="margin-top: 20px;">
              Si no solicitaste esta verificación, ignora este correo.
            </p>
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div class="footer">
            <p>&copy; 2024 PracticaPro. Todos los derechos reservados.</p>
            <p>¿Necesitas ayuda? <a href="https://vatodev.xyz">Contáctanos</a></p>
          </div>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
    }

    // Nuevo método para enviar la nueva contraseña
    async sendResetPasswordEmail(username: string, to: string, newPassword: string): Promise<void> {
        const from = this.configService.get<string>('SENDGRID_FROM') || 'noreply@example.com';
        const htmlTemplate = this.getResetPasswordTemplate(username, newPassword);

        const msg = {
            to,
            from,
            subject: 'Restablecimiento de Contraseña',
            html: htmlTemplate,
        };

        try {
            await sgMail.send(msg);
            console.log(`Correo de restablecimiento enviado a ${to}`);
        } catch (error) {
            console.error('Error al enviar el correo de restablecimiento:', error);
            throw new Error('No se pudo enviar el correo de restablecimiento de contraseña.');
        }
    }

    private getResetPasswordTemplate(username: string, newPassword: string): string {
        return `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Restablecimiento de Contraseña</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f4f4f7;
        font-family: Arial, sans-serif;
      }
      table {
        border-spacing: 0;
        border-collapse: collapse;
        width: 100%;
      }
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border: 1px solid #ddd;
        border-radius: 8px;
        overflow: hidden;
      }
      .header {
        background-color: #4caf50;
        padding: 20px;
        text-align: center;
        color: #ffffff;
        font-size: 24px;
        font-weight: bold;
      }
      .content {
        padding: 20px;
        text-align: center;
        color: #555555;
      }
      .content h2 {
        margin-top: 0;
        font-size: 20px;
      }
      .content p {
        line-height: 1.6;
        margin: 10px 0;
      }
      .password-box {
        display: inline-block;
        padding: 10px 20px;
        margin-top: 20px;
        background-color: #f4f4f7;
        border: 2px dashed #4caf50;
        font-size: 24px;
        font-weight: bold;
        color: #4caf50;
      }
      .footer {
        padding: 20px;
        text-align: center;
        font-size: 14px;
        color: #777777;
      }
      .footer a {
        color: #4caf50;
        text-decoration: none;
      }
      .footer a:hover {
        text-decoration: underline;
      }
      @media (max-width: 600px) {
        .email-container {
          border-radius: 0;
        }
        .content {
          padding: 15px;
        }
        .header {
          font-size: 20px;
          padding: 15px;
        }
      }
    </style>
  </head>
  <body>
    <table role="presentation" class="email-container">
      <tr>
        <td>
          <div class="header">
            Restablecimiento de Contraseña
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div class="content">
            <h2>Hola, ${username}</h2>
            <p>Se ha generado una nueva contraseña para su cuenta.</p>
            <p><strong>Nueva Contraseña:</strong></p>
            <div class="password-box">${newPassword}</div>
            <p>Por motivos de seguridad, se recomienda cambiar esta contraseña una vez que inicie sesión.</p>
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div class="footer">
            <p>&copy; 2024 PracticaPro. Todos los derechos reservados.</p>
            <p>¿Necesitas ayuda? <a href="https://vatodev.xyz">Contáctanos</a></p>
          </div>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
    }
}
