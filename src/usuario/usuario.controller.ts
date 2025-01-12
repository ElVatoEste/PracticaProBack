import { Controller, Get, Req, UseGuards, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsuarioService } from './usuario.service';

@Controller('usuario')
export class UsuarioController {
    private readonly logger = new Logger(UsuarioController.name);

    constructor(private readonly usuarioService: UsuarioService) {}

    @Get('profile')
    @UseGuards(AuthGuard('jwt'))
    async getProfile(@Req() req: any) {
        const userId = req.user.userId;
        return this.usuarioService.getBasicUserInfo(userId);
    }
}
