import { Module } from '@nestjs/common';

import { FileRepositoryModule } from '@/files/infra/repository/file.module';
import { StorageModule } from '@/files/infra/storage/storage.module';

import { DownloadFileHandler } from './download-file.handler';

@Module({
  imports: [FileRepositoryModule, StorageModule],
  providers: [DownloadFileHandler],
  exports: [DownloadFileHandler],
})
export class DownloadFileModule {}
