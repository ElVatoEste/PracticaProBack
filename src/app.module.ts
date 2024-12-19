import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importa el módulo de TypeORM
import { TestModule } from './test/test.module';
import { config } from 'dotenv';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';

config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'test_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    TestModule,
    UsuarioModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
