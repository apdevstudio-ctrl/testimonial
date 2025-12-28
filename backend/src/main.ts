import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as cors from 'cors';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Security
  app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for script injection
    crossOriginEmbedderPolicy: false, // Allow cross-origin embedding
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow cross-origin resources
  }));
  app.use(
    cors({
      origin: [
        configService.get('FRONTEND_URL') || 'http://localhost:3001',
        configService.get('SCRIPT_URL') || 'http://localhost:3000',
        // Allow all origins for script injection (can be restricted in production)
        /^https?:\/\/.*$/,
      ],
      credentials: true,
    }),
  );

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global prefix for API routes only (script.js should be at root)
  // We'll set the prefix after registering script.js route
  // For now, script.js will be at /api/script.js
  app.setGlobalPrefix('api');

  const port = configService.get('PORT') || 3000;
  await app.listen(port);
  console.log(`🚀 Backend server running on http://localhost:${port}`);
}

bootstrap();

