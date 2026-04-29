import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // 1. Configuración de Validación Global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remueve propiedades que no estén en el DTO
    forbidNonWhitelisted: true, // Rebota la petición si hay propiedades extra
    transform: true, // Transforma los tipos automáticamente (ej: string a number)
  }));

  const config = new DocumentBuilder()
    .setTitle('Cloud Academy API')
    .setDescription('The Cloud Academy API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
