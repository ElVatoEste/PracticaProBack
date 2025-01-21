import { BadRequestException, Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotasService } from './notas.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(AuthGuard('jwt'))
@Controller('notas')
@ApiBearerAuth()
export class NotasController {
    constructor(private readonly notasService: NotasService) {}

    @Get()
    async getNotes(@Req() req: any) {
        const userId = req.user.userId;
        return await this.notasService.getNotasByUserId(userId);
    }

    @Post()
    async addNote(@Req() req: any, @Body() body: { idMateria: number; puntaje: number }) {
        const userId = req.user.userId;
        const { idMateria, puntaje } = body;

        if (!idMateria || puntaje == null) {
            throw new BadRequestException('idMateria y puntaje son obligatorios');
        }

        return this.notasService.addNote(userId, idMateria, puntaje);
    }
}
