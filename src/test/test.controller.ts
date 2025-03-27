import { Controller, Get, UseGuards } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(AuthGuard('jwt'))
@Controller('test')
export class TestController {
    constructor(private readonly emailService: EmailService) {}

    @Get()
    @ApiBearerAuth()
    getTest(): { message: string } {
        return { message: 'El servidor está funcionando correctamente!' };
    }

    @Get('send-email')
    @ApiBearerAuth()
    async sendTestEmail(): Promise<{ message: string }> {
        const testEmail = 'malopezvelasquez@uamv.edu.ni';
        const testUsername = 'Usuario de Prueba';
        const verificationCode = '123456';
        try {
            await this.emailService.sendEmailVerification(testUsername, testEmail, verificationCode);
            return { message: `Correo enviado exitosamente a ${testEmail}` };
        } catch (error) {
            console.error('Error al enviar el correo:', error);
            return { message: 'Error al enviar el correo.' };
        }
    }
}
