import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { config } from 'dotenv';

config();

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

    await nestApp.init();
    app = expressApp;
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
if (process.env.IS_OFFLINE === 'true') {
  createServer().then((expressApp) => {
    const port = process.env.PORT || 3000;
    expressApp.listen(port, () => {
      console.log(`🚀 Servidor corriendo en local: http://localhost:${port}`);
    });
  });
}
