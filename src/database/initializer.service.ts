import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class InitializerService {
    constructor(private readonly dataSource: DataSource) {}

    async run() {
        await this.dataSource.query(`
            INSERT INTO materia ("idMateria", nombre)
            VALUES
                (1, 'TECNICAS'),
                (2, 'PROCEDIMIENTOS'),
                (3, 'ADMINISTRACION'),
                (4, 'URGENCIAS'),
                (5, 'PROCEDIMIENTOS2')
            ON CONFLICT ("idMateria") DO NOTHING;
        `);
        console.log('✅ Configuración inicial completada');
    }
}
