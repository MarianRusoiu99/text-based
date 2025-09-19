import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Set global prefix for all routes
  app.setGlobalPrefix('api');
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Enable CORS for frontend
  app.enableCors({
    origin: 'http://localhost:5173', // Vite dev server
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(process.env.PORT || 3000);
  console.log(`Server is listening on port ${process.env.PORT || 3000}`);
}
void bootstrap();
