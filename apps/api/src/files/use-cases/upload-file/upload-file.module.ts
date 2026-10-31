import { Module } from '@nestjs/common';
import { FileRepositoryModule } from '../../infra/repository/file.module';
import { UploadFileHandler } from './upload-file.handler';
import { StorageModule } from '../../infra/storage/storage.module';
import { UuidModule } from '../../../shared/infra/uuid/uuid.module';

@Module({
  imports: [FileRepositoryModule, StorageModule, UuidModule],
  providers: [UploadFileHandler],
  exports: [UploadFileHandler],
})
export class UploadFileModule {}
