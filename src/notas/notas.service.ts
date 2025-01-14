import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotasUsuario } from '../entities/notas-usuario.entity';

@Injectable()
export class NotasService {
    constructor(
        @InjectRepository(NotasUsuario)
        private readonly notasRepository: Repository<NotasUsuario>,
        private readonly dataSource: DataSource
    ) {}

    async getNotasByUserId(userId: number) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.query(`SELECT * FROM get_user_notes($1)`, [userId]);
        } finally {
            await queryRunner.release();
        }
    }

    // Agregar una nueva nota
    async addNote(userId: number, idMateria: number, puntaje: number) {
        const notasExistentes = await this.notasRepository.find({
            where: { usuario: { idUsuario: userId }, materia: { idMateria: idMateria } },
            order: { intento: 'ASC' },
        });

        if (notasExistentes.length >= 2) {
            throw new BadRequestException('Ya se ha alcanzado el límite de intentos para esta materia.');
        }

        const nuevoIntento = notasExistentes.length + 1;

        const nuevaNota = this.notasRepository.create({
            usuario: { idUsuario: userId },
            materia: { idMateria: idMateria },
            puntaje,
            intento: nuevoIntento,
        });

        return await this.notasRepository.save(nuevaNota);
    }
}
