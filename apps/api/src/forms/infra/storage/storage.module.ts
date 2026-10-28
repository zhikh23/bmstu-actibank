import { Inject, Module, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import { StorageService } from './storage.service';
import { S3_CLIENT } from './storage.tokens';

@Module({
  providers: [
    {
      provide: S3_CLIENT,
      useFactory: (config: ConfigService) => {
        const endpoint = config.get<string>('S3_ENDPOINT');
        return new S3Client({
          region: config.getOrThrow<string>('S3_REGION'),
          ...(endpoint && {
            endpoint,
            forcePathStyle: true, // Обязательно для MinIO
          }),
          credentials: {
            accessKeyId: config.getOrThrow('S3_ACCESS_KEY'),
            secretAccessKey: config.getOrThrow('S3_SECRET_ACCESS_KEY'),
          },
        });
      },
      inject: [ConfigService],
    },
    StorageService,
  ],
  exports: [S3_CLIENT, StorageService],
})
export class StorageModule implements OnApplicationShutdown {
  constructor(@Inject(S3_CLIENT) private readonly s3: S3Client) {}

  async onApplicationShutdown() {
    this.s3.destroy();
  }
}
