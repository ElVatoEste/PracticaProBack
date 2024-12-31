import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

let app: express.Express;

async function createServer() {
    if (!app) {
        const expressApp = express();
        const nestApp = await NestFactory.create(
            AppModule,
            new ExpressAdapter(expressApp),
            {
                logger: ['error', 'warn', 'log'],
                cors: true,
            }
        );

        nestApp.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            })
        );

        // Asignar a la variable `app` para evitar inicialización redundante
        app = expressApp;

        // Inicializar la aplicación NestJS
        await nestApp.init();
    }
    return app;
}

export default async function handler(req: any, res: any) {
    try {
        const server = await createServer();

        if (req.url === '/') {
            return res.status(200).json({ message: 'API is running' });
        }

        return new Promise((resolve, reject) => {
            server(req, res, (err: any) => {
                if (err) {
                    reject(err);
                }
                resolve(undefined);
            });
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Internal Server Error',
            message: error.message,
        });
    }
}

// Solo para desarrollo local
async function runLocal() {
    const nestApp = await NestFactory.create(AppModule);
    const configService = nestApp.get(ConfigService);

    const isOffline = configService.get<boolean>('IS_OFFLINE', false);
    const port = configService.get<number>('PORT', 3000);

    if (isOffline) {
        createServer().then((expressApp) => {
            expressApp.listen(port, () => {
                console.log(
                    `🚀 Servidor corriendo en local: http://localhost:${port}`
                );
            });
        });
    }
}

// Ejecutar solo en modo desarrollo local
runLocal();
