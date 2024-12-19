import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsuarioService } from '../usuario/usuario.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usuarioService: UsuarioService
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() body: { nombre: string; email: string; password: string }
  ) {
    const usuario = await this.usuarioService.createUser(body);
    const tokenData = await this.authService.generateToken(usuario);
    return {
      user: {
        nombre: usuario.nombre,
        email: usuario.email,
      },
      ...tokenData,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { email: string; password: string }) {
    const usuario = await this.authService.validateUser(
      body.email,
      body.password
    );
    if (!usuario) {
      return { message: 'Invalid email or password' };
    }

    const tokenData = await this.authService.generateToken(usuario);
    return {
      user: {
        nombre: usuario.nombre,
        email: usuario.email,
      },
      ...tokenData,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout() {
    return { message: 'Logout successful' };
  }
}
