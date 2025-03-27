import { Controller, Get, Req, UseGuards, Post, Body, HttpStatus, HttpException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsuarioService } from './usuario.service';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger';
import { ChangePasswordDto } from '../dto/changePassword.dto';

@ApiTags('usuario')
@UseGuards(AuthGuard('jwt'))
@Controller('usuario')
export class UsuarioController {
    constructor(private readonly usuarioService: UsuarioService) {}

    @Get('profile')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener perfil del usuario' })
    async getProfile(@Req() req: any) {
        const userId = req.user.userId;
        return this.usuarioService.getBasicUserInfo(userId);
    }

    @Post('change-password')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Cambiar la contraseña del usuario' })
    @ApiBody({ type: ChangePasswordDto })
    async changePassword(@Req() req: any, @Body() changePasswordDto: ChangePasswordDto) {
        const { oldPassword, newPassword } = changePasswordDto;
        const userId = req.user.userId;

        const result = await this.usuarioService.resetPassword(userId, oldPassword, newPassword);

        if (result) {
            return {
                statusCode: HttpStatus.OK,
                message: 'Contraseña actualizada exitosamente',
            };
        } else {
            throw new HttpException(
                {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'No se pudo actualizar la contraseña',
                },
                HttpStatus.BAD_REQUEST
            );
        }
    }
}
