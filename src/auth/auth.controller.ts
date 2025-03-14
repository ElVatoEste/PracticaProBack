import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException, NotFoundException, HttpException, BadRequestException } from '@nestjs/common';

import { AuthService } from './auth.service';
import { UsuarioService } from '../usuario/usuario.service';
import { EmailService } from '../email/email.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ConfirmDto } from './dto/confirm.dto';
import { ResendDto } from './dto/resend.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
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
        try {
            const usuario = await this.authService.validateUser(loginDto.email, loginDto.password);

            const tokenData = await this.authService.generateToken(usuario);
            return {
                message: 'Inicio de sesión exitoso',
                user: {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    email: usuario.email,
                },
                ...tokenData,
            };
        } catch (error) {
            if (error instanceof UnauthorizedException && error.getResponse()['isConfirmed'] === false) {
                throw new HttpException(
                    {
                        statusCode: 401,
                        message: error.getResponse()['message'],
                        isConfirmed: false,
                    },
                    HttpStatus.UNAUTHORIZED
                );
            }
            throw error;
        }
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

        const existingCode = await this.usuarioService.getExistingValidAuthCode(email);

        if (existingCode) {
            const timeRemaining = Math.ceil((existingCode.expiresAt.getTime() - new Date().getTime()) / 60000);
            throw new BadRequestException({
                message: `Por favor, espera ${timeRemaining} minutos antes de solicitar un nuevo código.`,
                success: false,
            });
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

    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Resetear contraseña: genera una nueva contraseña, la envía por correo y actualiza la base de datos' })
    @ApiResponse({ status: 200, description: 'La nueva contraseña fue enviada al correo del usuario.' })
    @ApiBody({ type: ResetPasswordDto })
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
        return await this.authService.resetPassword(resetPasswordDto.email);
    }
}
