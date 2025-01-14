import { Controller, Get, Req, UseGuards, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsuarioService } from './usuario.service';

@UseGuards(AuthGuard('jwt'))
@Controller('usuario')
export class UsuarioController {
    private readonly logger = new Logger(UsuarioController.name);

    constructor(private readonly usuarioService: UsuarioService) {}

    @Get('profile')
    async getProfile(@Req() req: any) {
        console.log(req.user.userId);
        const userId = req.user.userId;
        return this.usuarioService.getBasicUserInfo(userId);
    }
}
