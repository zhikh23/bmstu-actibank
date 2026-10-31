import { Module } from '@nestjs/common';
import { FileRepositoryModule } from '../../infra/repository/file.module';
import { DownloadFileHandler } from './download-file.handler';
import { StorageModule } from '../../infra/storage/storage.module';

@Module({
  imports: [FileRepositoryModule, StorageModule],
  providers: [DownloadFileHandler],
  exports: [DownloadFileHandler],
})
export class DownloadFileModule {}
