import { Module } from '@nestjs/common';

import { DownloadFileModule } from '@/files/use-cases/download-file/download-file.module';
import { UploadFileModule } from '@/files/use-cases/upload-file/upload-file.module';

import { FilesService } from './files.service';

@Module({
  imports: [UploadFileModule, DownloadFileModule],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesServiceModule {}
