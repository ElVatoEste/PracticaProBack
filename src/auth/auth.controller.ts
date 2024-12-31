import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    UnauthorizedException,
    NotFoundException,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { UsuarioService } from '../usuario/usuario.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { EmailService } from '../email/email.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usuarioService: UsuarioService,
        private readonly emailService: EmailService
    ) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(
        @Body() registerDto: RegisterDto
    ): Promise<{ message: string }> {
        const usuario = await this.usuarioService.createUser(registerDto);

        const verificationCode =
            await this.usuarioService.generateEmailVerificationCode(usuario.id);

        try {
            await this.emailService.sendEmailVerification(
                usuario.nombre,
                usuario.email,
                verificationCode
            );
        } catch (error) {
            console.error('Error al enviar el correo:', error);
            return {
                message:
                    'Usuario registrado, pero no se pudo enviar el correo.',
            };
        }

        return {
            message:
                'Registro exitoso. Por favor, verifica tu correo electrónico.',
        };
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto) {
        const usuario = await this.authService.validateUser(
            loginDto.email,
            loginDto.password
        );
        if (!usuario) {
            throw new UnauthorizedException('Correo o contraseña inválidos');
        }

        const tokenData = await this.authService.generateToken(usuario);
        return {
            message: 'Usuario registrado con éxito',
            user: {
                nombre: usuario.nombre,
                email: usuario.email,
            },
            ...tokenData,
        };
    }

    @Post('confirm-email')
    @HttpCode(HttpStatus.OK)
    async confirmEmail(
        @Body() body: { email: string; code: string }
    ): Promise<{ message: string }> {
        const { email, code } = body;

        await this.usuarioService.confirmEmail(email, code);

        return { message: 'Correo electrónico confirmado exitosamente.' };
    }

    @Post('resend-verification')
    @HttpCode(HttpStatus.OK)
    async resendVerificationCode(
        @Body() body: { email: string }
    ): Promise<{ message: string }> {
        const { email } = body;

        const user = await this.usuarioService.findByEmail(email);
        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }

        if (user.isEmailConfirmed) {
            return {
                message: 'El correo electrónico ya está confirmado.',
            };
        }
        const newCode = await this.usuarioService.generateEmailVerificationCode(
            user.id
        );
        try {
            await this.emailService.sendEmailVerification(
                user.nombre,
                user.email,
                newCode
            );
            return {
                message: 'Código de verificación reenviado exitosamente.',
            };
        } catch (error) {
            console.error('Error al enviar el correo:', error);
            return {
                message: 'No se pudo reenviar el código de verificación.',
            };
        }
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout() {
        return { message: 'Logout successful' };
    }
}
