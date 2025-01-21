import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from '../usuario/usuario.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly usuarioService: UsuarioService,
        private readonly jwtService: JwtService
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
}
