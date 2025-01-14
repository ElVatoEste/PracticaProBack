import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestModule } from './test/test.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { NotasModule } from './notas/notas.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('DB_HOST', 'localhost'),
                port: configService.get<number>('DB_PORT', 5432),
                username: configService.get<string>('DB_USERNAME', 'postgres'),
                password: configService.get<string>('DB_PASSWORD', 'password'),
                database: configService.get<string>('DB_NAME', 'test_db'),
                autoLoadEntities: true,
                synchronize: true,
            }),
            inject: [ConfigService],
        }),
        TestModule,
        UsuarioModule,
        AuthModule,
        EmailModule,
        NotasModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
