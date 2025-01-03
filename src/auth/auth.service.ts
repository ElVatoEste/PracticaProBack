import { Injectable, UnauthorizedException } from '@nestjs/common';
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
            throw new UnauthorizedException('Usuario no encontrado.');
        }

        if (!usuario.isEmailConfirmed) {
            throw new UnauthorizedException({
                statusCode: 401,
                message: 'Correo electrónico no confirmado. Por favor, verifica tu correo.',
                isConfirmed: false,
            });
        }

        const isPasswordValid = await bcrypt.compare(password, usuario.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Contraseña incorrecta.');
        }

        return usuario;
    }

    async generateToken(usuario: any): Promise<{ accessToken: string; expiresIn: number }> {
        const payload = {
            sub: usuario.id,
            username: usuario.nombre,
            email: usuario.email,
        };
        const expiresIn = 3600;
        const accessToken = this.jwtService.sign(payload, { expiresIn });
        return { accessToken, expiresIn };
    }
}
