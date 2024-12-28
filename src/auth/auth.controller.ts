import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException } from "@nestjs/common";
import { AuthService } from './auth.service';
import { UsuarioService } from '../usuario/usuario.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usuarioService: UsuarioService
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    const usuario = await this.usuarioService.createUser(registerDto);
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

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout() {
    return { message: 'Logout successful' };
  }
}
