import { S3Client } from '@aws-sdk/client-s3';
import { Inject, Module, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { StorageService } from './storage.service';
import { S3_CLIENT, STORAGE_PORT } from './storage.tokens';

@Module({
  providers: [
    {
      provide: S3_CLIENT,
      useFactory: (config: ConfigService) => {
        return new S3Client({
          region: config.getOrThrow<string>('S3_REGION'),
          endpoint: config.getOrThrow('S3_ENDPOINT'),
          credentials: {
            accessKeyId: config.getOrThrow('S3_ACCESS_KEY'),
            secretAccessKey: config.getOrThrow('S3_SECRET_ACCESS_KEY'),
          },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: STORAGE_PORT,
      useExisting: StorageService,
    },
    StorageService,
  ],
  exports: [STORAGE_PORT],
})
export class StorageModule implements OnApplicationShutdown {
  constructor(@Inject(S3_CLIENT) private readonly s3: S3Client) {}

  async onApplicationShutdown(): Promise<void> {
    this.s3.destroy();
  }
}
