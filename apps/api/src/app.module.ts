import { createKeyv } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';

import { AuthModule } from '@/auth/auth.module';
import { CatalogModule } from '@/catalog/catalog.module';
import { FilesModule } from '@/files/files.module';
import { FormsModule } from '@/forms/forms.module';
import { StudentsModule } from '@/students/students.module';
import { EventsModule } from '@/events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined,
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        autoLoadEntities: true,
        host: cfg.get('DB_HOST'),
        port: cfg.get('DB_PORT'),
        username: cfg.get('DB_USERNAME'),
        password: cfg.get('DB_PASSWORD'),
        database: cfg.get('DB_DATABASE'),
      }),
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (cfg: ConfigService) => ({
        stores: [createKeyv(cfg.getOrThrow('REDIS_URI'))],
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    CatalogModule,
    FilesModule,
    FormsModule,
    StudentsModule,
    EventsModule,
  ],
})
export class AppModule {}
