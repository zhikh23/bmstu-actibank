/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const globalPrefix = 'api/v1';

async function bootstrap() {
  const appOptions = { cors: true };
  const app = await NestFactory.create(AppModule, appOptions);

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix(globalPrefix);

  const docsConfig = new DocumentBuilder()
    .setTitle('bmstu-actibank')
    .setDescription('Сервис регистрации мероприятий в МГТУ им. Н.Э. Баумана')
    .setVersion('1.0')
    .build();
  const docFactory = () => SwaggerModule.createDocument(app, docsConfig);
  SwaggerModule.setup('docs', app, docFactory);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
