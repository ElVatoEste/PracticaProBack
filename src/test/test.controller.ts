import { Controller, Get } from '@nestjs/common';
import { EmailService } from '../email/email.service';

@Controller('test')
export class TestController {
  constructor(private readonly emailService: EmailService) {}

  @Get()
  getTest(): { message: string } {
    return { message: 'El servidor está funcionando correctamente!' };
  }

  @Get('send-email')
  async sendTestEmail(): Promise<{ message: string }> {
    const testEmail = 'cnro3105@gmail.com'; // Correo manual
    const testUsername = 'Usuario de Prueba';
    const verificationCode = '123456'; // Código de prueba

    try {
      await this.emailService.sendEmailVerification(
        testUsername,
        testEmail,
        verificationCode
      );
      return { message: `Correo enviado exitosamente a ${testEmail}` };
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      return { message: 'Error al enviar el correo.' };
    }
  }
}
