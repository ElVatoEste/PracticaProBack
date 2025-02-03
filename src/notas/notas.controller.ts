import { BadRequestException, Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotasService } from './notas.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('notas')
export class NotasController {
    constructor(private readonly notasService: NotasService) {}

    @UseGuards(AuthGuard('jwt'))
    @Get()
    @ApiBearerAuth()
    async getNotes(@Req() req: any) {
        const userId = req.user.userId;
        return await this.notasService.getNotasByUserId(userId);
    }

    // 🌍 Endpoint PÚBLICO
    @Get('info')
    async getFullInfo() {
        return await this.notasService.getFullInfo();
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    @ApiBearerAuth()
    async addNote(@Req() req: any, @Body() body: { idMateria: number; puntaje: number }) {
        const userId = req.user.userId;
        const { idMateria, puntaje } = body;

        if (!idMateria || puntaje == null) {
            throw new BadRequestException('idMateria y puntaje son obligatorios');
        }

        return this.notasService.addNote(userId, idMateria, puntaje);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('offline')
    @ApiBearerAuth()
    async addOfflineNote(@Body() body: { idUsuario: number; idMateria: number; puntaje: number }) {
        const { idMateria, puntaje, idUsuario } = body;

        if (!idMateria || puntaje == null) {
            throw new BadRequestException('idMateria y puntaje son obligatorios');
        }

        return this.notasService.addNote(idUsuario, idMateria, puntaje);
    }
}
