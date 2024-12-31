import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { AuthCode } from './auth-code.entity';

@Entity()
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ default: false })
    isEmailConfirmed: boolean;

    @OneToMany(() => AuthCode, (authCode) => authCode.usuario)
    authCodes: AuthCode[];
}
