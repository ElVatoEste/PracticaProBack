import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { NotasUsuario } from './notas-usuario.entity';

@Entity('materia')
export class Materia {
    @PrimaryGeneratedColumn()
    idMateria: number;

    @Column({ length: 100 })
    nombre: string;

    @OneToMany(() => NotasUsuario, (notasUsuario) => notasUsuario.materia)
    notas: NotasUsuario[];
}
