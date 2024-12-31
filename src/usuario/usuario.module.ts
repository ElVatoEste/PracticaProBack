import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../entities/usuario.entity';
import { AuthCode } from '../entities/auth-code.entity';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { EmailService } from '../email/email.service';

@Module({
    imports: [TypeOrmModule.forFeature([Usuario, AuthCode])],
    controllers: [UsuarioController],
    providers: [UsuarioService, EmailService],
    exports: [UsuarioService],
})
export class UsuarioModule {}
