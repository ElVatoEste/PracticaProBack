import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Materia } from './materia.entity';

@Entity('notas_usuarios')
export class NotasUsuario {
    @PrimaryGeneratedColumn()
    idNotas: number;

    @ManyToOne(() => Usuario, (usuario) => usuario.notas, {
        onDelete: 'CASCADE',
    })
    usuario: Usuario;

    @ManyToOne(() => Materia, (materia) => materia.notas, {
        onDelete: 'CASCADE',
    })
    materia: Materia;

    @Column('int')
    puntaje: number;

    @Column('int')
    intento: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fecha: Date;
}
