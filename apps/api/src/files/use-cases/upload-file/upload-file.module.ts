import { Module } from '@nestjs/common';

import { FileRepositoryModule } from '@/files/infra/repository/file.module';
import { StorageModule } from '@/files/infra/storage/storage.module';
import { UuidModule } from '@/shared/infra/uuid/uuid.module';

import { UploadFileHandler } from './upload-file.handler';

@Module({
  imports: [FileRepositoryModule, StorageModule, UuidModule],
  providers: [UploadFileHandler],
  exports: [UploadFileHandler],
})
export class UploadFileModule {}
