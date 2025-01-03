import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException, NotFoundException } from '@nestjs/common';

import { AuthService } from './auth.service';
import { UsuarioService } from '../usuario/usuario.service';
import { EmailService } from '../email/email.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ConfirmDto } from './dto/confirm.dto';
import { ResendDto } from './dto/resend.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usuarioService: UsuarioService,
        private readonly emailService: EmailService
    ) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Registrar un nuevo usuario' })
    @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente' })
    @ApiBody({ type: RegisterDto })
    async register(@Body() registerDto: RegisterDto): Promise<{ message: string }> {
        const usuario = await this.usuarioService.createUser(registerDto);

        const verificationCode = await this.usuarioService.generateEmailVerificationCode(usuario.id);

        try {
            await this.emailService.sendEmailVerification(usuario.nombre, usuario.email, verificationCode);
        } catch (error) {
            console.error('Error al enviar el correo:', error);
            return { message: 'Usuario registrado, pero no se pudo enviar el correo.' };
        }

        return { message: 'Registro exitoso. Por favor, verifica tu correo electrónico.' };
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Iniciar sesión con email y contraseña' })
    @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso' })
    @ApiBody({ type: LoginDto })
    async login(@Body() loginDto: LoginDto) {
        const usuario = await this.authService.validateUser(loginDto.email, loginDto.password);
        if (!usuario) {
            throw new UnauthorizedException('Correo o contraseña inválidos');
        }

        const tokenData = await this.authService.generateToken(usuario);
        return {
            message: 'Inicio de sesión exitoso',
            user: {
                nombre: usuario.nombre,
                email: usuario.email,
            },
            ...tokenData,
        };
    }

    @Post('confirm-email')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Confirmar el correo electrónico' })
    @ApiResponse({ status: 200, description: 'Correo electrónico confirmado exitosamente' })
    @ApiBody({ type: ConfirmDto })
    async confirmEmail(@Body() confirmEmailDto: ConfirmDto): Promise<{ message: string; success: boolean }> {
        const { email, code } = confirmEmailDto;

        await this.usuarioService.confirmEmail(email, code);

        return { message: 'Correo electrónico confirmado exitosamente.', success: true };
    }

    @Post('resend-verification')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Reenviar código de verificación de correo' })
    @ApiResponse({ status: 200, description: 'Código de verificación reenviado exitosamente' })
    @ApiBody({ type: ResendDto })
    async resendVerificationCode(@Body() resendVerificationDto: ResendDto): Promise<{ message: string }> {
        const { email } = resendVerificationDto;

        const user = await this.usuarioService.findByEmail(email);
        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }

        if (user.isEmailConfirmed) {
            return { message: 'El correo electrónico ya está confirmado.' };
        }

        const newCode = await this.usuarioService.generateEmailVerificationCode(user.id);

        try {
            await this.emailService.sendEmailVerification(user.nombre, user.email, newCode);
            return { message: 'Código de verificación reenviado exitosamente.' };
        } catch (error) {
            console.error('Error al enviar el correo:', error);
            return { message: 'No se pudo reenviar el código de verificación.' };
        }
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Cerrar sesión' })
    @ApiResponse({ status: 200, description: 'Sesión cerrada exitosamente' })
    async logout() {
        return { message: 'Logout successful' };
    }
}
