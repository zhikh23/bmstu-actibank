import { Module } from '@nestjs/common';
import { UploadFileModule } from '../use-cases/upload-file/upload-file.module';
import { DownloadFileModule } from '../use-cases/download-file/download-file.module';
import { FilesService } from './files.service';

@Module({
  imports: [UploadFileModule, DownloadFileModule],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesServiceModule {}
