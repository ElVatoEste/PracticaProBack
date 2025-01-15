import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Usuarios } from './usuarios.entity';
import { Materia } from './materia.entity';

@Entity('notas_usuarios')
export class NotasUsuario {
    @PrimaryGeneratedColumn()
    idNotas: number;

    @ManyToOne(() => Usuarios, (usuarios) => usuarios.notas, {
        onDelete: 'CASCADE',
    })
    usuario: Usuarios;

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
