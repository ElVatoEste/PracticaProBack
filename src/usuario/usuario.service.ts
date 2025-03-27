import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Usuarios } from '../entities/usuarios.entity';
import * as bcrypt from 'bcrypt';
import { AuthCode } from '../entities/auth-code.entity';

@Injectable()
export class UsuarioService {
    constructor(
        @InjectRepository(Usuarios)
        private readonly usuarioRepository: Repository<Usuarios>,
        @InjectRepository(AuthCode)
        private readonly authCodeRepository: Repository<AuthCode>
    ) {}

    async createUser(data: { nombre: string; email: string; password: string }): Promise<Usuarios> {
        const existingUser = await this.findByEmail(data.email);
        if (existingUser) {
            throw new ConflictException({
                message: 'El correo ya está registrado',
            });
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const newUser = this.usuarioRepository.create({
            nombre: data.nombre,
            email: data.email,
            password: hashedPassword,
        });
        return this.usuarioRepository.save(newUser);
    }

    async findByEmail(email: string): Promise<Usuarios> {
        return this.usuarioRepository.findOne({ where: { email } });
    }

    async getBasicUserInfo(userId: number) {
        const user = await this.usuarioRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }
        return {
            id: user.id,
            nombre: user.nombre,
            email: user.email,
        };
    }

    async generateEmailVerificationCode(userId: number): Promise<string> {
        const user = await this.usuarioRepository.findOne({ where: { id: userId } });

        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }
        const existingCode = await this.authCodeRepository.findOne({
            where: {
                usuario: { id: userId },
                isUsed: false,
                expiresAt: MoreThan(new Date()),
            },
        });

        if (existingCode) {
            return existingCode.code;
        }
        const code = this.generate6DigitCode();

        const authCode = this.authCodeRepository.create({
            usuario: user,
            email: user.email,
            code,
            expiresAt: this.getExpirationDate(10),
        });

        await this.authCodeRepository.save(authCode);
        return code;
    }

    async getExistingValidAuthCode(email: string): Promise<AuthCode | null> {
        return this.authCodeRepository.findOne({
            where: {
                email,
                isUsed: false,
                expiresAt: MoreThan(new Date()),
            },
            order: { createdAt: 'DESC' },
        });
    }

    async confirmEmail(email: string, code: string): Promise<void> {
        const authCode = await this.authCodeRepository.findOne({
            where: { usuario: { email: email }, code, isUsed: false },
        });

        if (!authCode || authCode.expiresAt < new Date()) {
            throw new BadRequestException({
                code: 400,
                message: 'Código inválido o expirado',
                success: false,
            });
        }

        authCode.isUsed = true;
        await this.authCodeRepository.save(authCode);

        const user = await this.usuarioRepository.findOne({
            where: { email: email },
        });
        user.isEmailConfirmed = true;
        await this.usuarioRepository.save(user);
    }

    async resetPassword(userId: number, oldPassword: string, newPassword: string): Promise<boolean> {
        const user = await this.usuarioRepository.findOne({ where: { id: userId } });

        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            throw new NotFoundException('Contraseña incorrecta');
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await this.usuarioRepository.save(user);

        return true;
    }

    async updatePassword(userId: number, newHashedPassword: string): Promise<Usuarios> {
        const user = await this.usuarioRepository.findOne({ where: { id: userId } });

        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }

        user.password = newHashedPassword;
        return await this.usuarioRepository.save(user);
    }

    private generate6DigitCode(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    private getExpirationDate(minutes: number): Date {
        const now = new Date();
        now.setMinutes(now.getMinutes() + minutes);
        return now;
    }
}
