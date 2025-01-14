import { Module } from '@nestjs/common';
import { NotasController } from './notas.controller';
import { NotasService } from './notas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotasUsuario } from '../entities/notas-usuario.entity';
import { Materia } from '../entities/materia.entity';

@Module({
    imports: [TypeOrmModule.forFeature([NotasUsuario, Materia])],
    controllers: [NotasController],
    providers: [NotasService],
})
export class NotasModule {}
