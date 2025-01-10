import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsuarioService } from './usuario.service';

@Controller('usuario')
export class UsuarioController {
    constructor(private readonly usuarioService: UsuarioService) {}

    @Get('profile')
    @UseGuards(AuthGuard('jwt'))
    async getProfile(@Req() req: any) {
        const userId = req.user.userId;
        return this.usuarioService.getBasicUserInfo(userId);
    }
}
