import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('auth_code')
export class AuthCode {
    @PrimaryGeneratedColumn()
    idCodigo: number;

    @ManyToOne(() => Usuario, (usuario) => usuario.authCodes, {
        onDelete: 'CASCADE',
    })
    usuario: Usuario;

    @Column({ nullable: true })
    email: string;

    @Column({ length: 6 })
    code: string;

    @Column()
    expiresAt: Date;

    @Column({ default: false })
    isUsed: boolean;

    @CreateDateColumn()
    createdAt: Date;
}
