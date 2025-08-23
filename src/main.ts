import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security middleware
  app.use(helmet());
  
  // Compression middleware
  app.use(compression());

  // Enable CORS
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted values are provided
      transform: true, // Transform payloads to be objects typed according to their DTO classes
      transformOptions: {
        enableImplicitConversion: true, // Enable implicit conversion of primitive types
      },
    }),
  );

  // Global prefix for all routes - MUST be set BEFORE Swagger document creation
  app.setGlobalPrefix('api/v1');

  // Swagger documentation setup
  const config = new DocumentBuilder()
    .setTitle('NestJS Production Backend API')
    .setDescription(
      'A production-ready NestJS backend with authentication, authorization, and enterprise features',
    )
    .setVersion('2.0')
    .addTag('authentication', 'User authentication and authorization')
    .addTag('users', 'User management operations')
    .addTag('feature', 'Feature operations')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`🚀 Production-ready application is running on: http://localhost:${port}`);
  console.log(
    `📚 Swagger documentation available at: http://localhost:${port}/api`,
  );
  console.log(`🔐 Authentication endpoints: http://localhost:${port}/api/v1/auth`);
}
bootstrap();
