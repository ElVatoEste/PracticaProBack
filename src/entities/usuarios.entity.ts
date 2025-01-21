import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { AuthCode } from './auth-code.entity';
import { NotasUsuario } from './notas-usuario.entity';

@Entity('usuarios')
export class Usuarios {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    nombre: string;

    @Column({ unique: true, length: 100 })
    email: string;

    @Column()
    password: string;

    @Column({ default: false })
    isEmailConfirmed: boolean;

    @OneToMany(() => AuthCode, (authCode) => authCode.usuario)
    authCodes: AuthCode[];

    @OneToMany(() => NotasUsuario, (notasUsuario) => notasUsuario.usuario)
    notas: NotasUsuario[];
}
