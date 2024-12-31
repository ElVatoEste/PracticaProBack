// src/email/email.module.ts
import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigModule } from '@nestjs/config'; // Para acceder a las configuraciones

@Module({
    imports: [ConfigModule],
    providers: [EmailService],
    exports: [EmailService],
})
export class EmailModule {}
