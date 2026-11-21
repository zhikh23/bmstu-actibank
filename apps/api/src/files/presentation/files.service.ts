import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';

import { DownloadFileHandler } from '@/files/use-cases/download-file/download-file.handler';
import { UploadFileHandler } from '@/files/use-cases/upload-file/upload-file.handler';
import { AuthenticatedUser } from '@/shared/domain/authenticated-user.entity';

import { FormDataFileDto } from './dto/form-data-file.dto';
import { UploadFileResponse } from './dto/upload-file.response';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);

  constructor(
    private readonly uploadFile: UploadFileHandler,
    private readonly downloadFile: DownloadFileHandler,
  ) {}

  async upload(
    actor: AuthenticatedUser,
    req: FormDataFileDto,
  ): Promise<UploadFileResponse> {
    const result = await this.uploadFile.execute({
      actor,
      contentType: req.mimetype,
      filename: req.originalname,
      body: req.buffer,
    });

    return result.match(
      (res) => res,
      (err) => {
        switch (err.kind) {
          case 'NotFound':
            throw new NotFoundException(err.message);
          default:
            this.logger.error(err);
            throw new InternalServerErrorException();
        }
      },
    );
  }

  async download(
    actor: AuthenticatedUser,
    fileId: string,
  ): Promise<StreamableFile> {
    const result = await this.downloadFile.execute({
      actor,
      fileId,
    });

    return result.match(
      (file) =>
        new StreamableFile(file.body, {
          type: file.contentType,
          disposition: `attachment; filename="${file.filename}"`,
          length: file.contentLength,
        }),
      (err) => {
        switch (err.kind) {
          case 'Forbidden':
            throw new ForbiddenException(err.reason);
          case 'NotFound':
            throw new NotFoundException(err.message);
          default:
            this.logger.error(err);
            throw new InternalServerErrorException();
        }
      },
    );
  }
}
