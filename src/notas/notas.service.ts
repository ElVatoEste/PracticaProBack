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
            return await queryRunner.query(`SELECT * FROM get_notas_by_usuario($1)`, [userId]);
        } finally {
            await queryRunner.release();
        }
    }

    async getFullInfo() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            return await queryRunner.query(
                `
                    SELECT
                        u.id AS "usuarioId",
                        u.nombre AS "usuario",
                        u.email AS "correo",
                        m.id AS "materiaId",
                        m.nombre AS "materia",
                        n.intento,
                        n.puntaje,
                        n.fecha
                    FROM notas_usuarios n
                             JOIN usuarios u ON n."usuarioId" = u.id
                             JOIN materia m ON n."materiaId" = m.id
                    ORDER BY u.id, m.nombre, n.intento;
                `
            );
        } finally {
            await queryRunner.release();
        }
    }

    // Agregar una nueva nota
    async addNote(userId: number, idMateria: number, puntaje: number) {
        const notasExistentes = await this.notasRepository.find({
            where: { usuario: { id: userId }, materia: { id: idMateria } },
            order: { intento: 'ASC' },
        });

        if (notasExistentes.length >= 2) {
            throw new BadRequestException('Ya se ha alcanzado el límite de intentos para esta materia.');
        }

        const nuevoIntento = notasExistentes.length + 1;

        const nuevaNota = this.notasRepository.create({
            usuario: { id: userId },
            materia: { id: idMateria },
            puntaje,
            intento: nuevoIntento,
        });

        return await this.notasRepository.save(nuevaNota);
    }
}
