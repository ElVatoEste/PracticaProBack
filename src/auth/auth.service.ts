import { Injectable } from '@nestjs/common';
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
    if (usuario && (await bcrypt.compare(password, usuario.password))) {
      const { password, ...result } = usuario;
      return result;
    }
    return null;
  }

  async generateToken(
    usuario: any
  ): Promise<{ accessToken: string; expiresIn: number }> {
    const payload = {
      sub: usuario.id,
      username: usuario.nombre,
      email: usuario.email,
    };
    const expiresIn = 3600; // Tiempo de expiración en segundos
    const accessToken = this.jwtService.sign(payload, { expiresIn });
    return { accessToken, expiresIn };
  }
}
