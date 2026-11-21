import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

import { AppModule } from './app.module';

const globalPrefix = 'api/v1';

async function bootstrap() {
  const appOptions = {
    bufferLogs: true,
  };
  const app = await NestFactory.create(AppModule, appOptions);

  app.useLogger(app.get(Logger));
  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN
      ? process.env.FRONTEND_ORIGIN.split(',').map((origin) => origin.trim())
      : [
          'http://localhost:5173',
          'http://127.0.0.1:5173',
          'http://localhost:5174',
          'http://127.0.0.1:5174',
        ],
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  const docsConfig = new DocumentBuilder()
    .setTitle('bmstu-actibank')
    .setDescription('Сервис регистрации мероприятий в МГТУ им. Н.Э. Баумана.')
    .setVersion('1.0')
    .addCookieAuth('actibank_session', {
      type: 'apiKey',
      in: 'cookie',
      description:
        'Серверная сессия, устанавливаемая после OIDC-аутентификации.',
    })
    .build();
  const docFactory = () => SwaggerModule.createDocument(app, docsConfig);
  SwaggerModule.setup(globalPrefix + '/docs', app, docFactory);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
