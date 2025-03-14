import { HttpException, Injectable, HttpStatus, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from '../usuario/usuario.service';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly usuarioService: UsuarioService,
        private readonly jwtService: JwtService,
        private readonly emailService: EmailService
    ) {}

    async validateUser(email: string, password: string): Promise<any> {
        const usuario = await this.usuarioService.findByEmail(email);

        if (!usuario) {
            throw new HttpException(
                {
                    statusCode: HttpStatus.UNAUTHORIZED,
                    message: 'Usuario no encontrado.',
                    isConfirmed: null,
                },
                HttpStatus.UNAUTHORIZED
            );
        }

        if (!usuario.isEmailConfirmed) {
            throw new HttpException(
                {
                    statusCode: HttpStatus.UNAUTHORIZED,
                    message: 'Correo electrónico no confirmado. Por favor, verifica tu correo.',
                    isConfirmed: false,
                },
                HttpStatus.UNAUTHORIZED
            );
        }

        const isPasswordValid = await bcrypt.compare(password, usuario.password);
        if (!isPasswordValid) {
            throw new HttpException(
                {
                    statusCode: HttpStatus.UNAUTHORIZED,
                    message: 'Contraseña incorrecta.',
                    isConfirmed: true,
                },
                HttpStatus.UNAUTHORIZED
            );
        }

        return usuario;
    }

    async generateToken(usuario: any): Promise<{ accessToken: string; expiresIn: number }> {
        const payload = {
            sub: usuario.id,
            username: usuario.nombre,
            email: usuario.email,
        };

        // 🔧 Configura la expiración a 7 días
        const expiresIn = 7 * 24 * 60 * 60;
        const accessToken = this.jwtService.sign(payload, { expiresIn });
        return { accessToken, expiresIn };
    }

    async resetPassword(email: string): Promise<{ message: string }> {
        // Buscar usuario por correo
        const usuario = await this.usuarioService.findByEmail(email);
        if (!usuario) {
            throw new NotFoundException('Usuario no encontrado');
        }

        const newPassword = this.generateRandomPassword(8);
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await this.usuarioService.updatePassword(usuario.id, hashedPassword);
        await this.emailService.sendResetPasswordEmail(usuario.nombre, usuario.email, newPassword);
        return { message: 'Se ha enviado la nueva contraseña a su correo.' };
    }

    private generateRandomPassword(length: number = 8): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let password = '';
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }
}
