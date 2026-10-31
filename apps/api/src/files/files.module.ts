import { Module } from '@nestjs/common';
import { UploadFileModule } from './use-cases/upload-file/upload-file.module';
import { DownloadFileModule } from './use-cases/download-file/download-file.module';
import { FilesController } from './presentation/files.controller';
import { FilesService } from './presentation/files.service';

@Module({
  imports: [DownloadFileModule, UploadFileModule],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
