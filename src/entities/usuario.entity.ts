// usuario.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { EmailConfirmation } from './email-confirmation.entity';

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

  // Relación inversa: un usuario puede tener múltiples tokens de verificación
  @OneToMany(() => EmailConfirmation, (ec) => ec.usuario)
  emailConfirmations: EmailConfirmation[];
}
