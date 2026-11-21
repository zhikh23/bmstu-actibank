import { Module } from '@nestjs/common';

import { FilesController } from './presentation/files.controller';
import { FilesService } from './presentation/files.service';
import { DownloadFileModule } from './use-cases/download-file/download-file.module';
import { UploadFileModule } from './use-cases/upload-file/upload-file.module';

@Module({
  imports: [DownloadFileModule, UploadFileModule],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
