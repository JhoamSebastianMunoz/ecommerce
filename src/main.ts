import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('server.port', 3000);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('E-commerce Backend API')
    .setDescription('E-commerce backend built with DDD + Hexagonal Architecture')
    .setVersion('1.0')
    .addTag('Health')
    .addTag('Catálogo')
    .addTag('Carrito')
    .addTag('Promociones')
    .addTag('Checkout')
    .addTag('Pagos')
    .addTag('Envíos')
    .addTag('Devoluciones')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'X-Correlation-Id',
        in: 'header',
        description: 'Correlation ID for request tracing',
      },
      'X-Correlation-Id',
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'Idempotency-Key',
        in: 'header',
        description: 'Idempotency key for safe retries',
      },
      'Idempotency-Key',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger docs available at: http://localhost:${port}/api/docs`);
}

void bootstrap();
