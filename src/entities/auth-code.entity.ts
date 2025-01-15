import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Usuarios } from './usuarios.entity';

@Entity('auth_code')
export class AuthCode {
    @PrimaryGeneratedColumn()
    idCodigo: number;

    @ManyToOne(() => Usuarios, (usuarios) => usuarios.authCodes, {
        onDelete: 'CASCADE',
    })
    usuario: Usuarios;

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
