import { Injectable } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';

import { DownloadFileHandler } from '@/files/use-cases/download-file/download-file.handler';
import { UploadFileHandler } from '@/files/use-cases/upload-file/upload-file.handler';

import {
  DownloadFileRequest,
  DownloadFileResponse,
  UploadFileRequest,
  UploadFileResponse,
} from './dto';

export type FilesServiceError =
  | { kind: 'NotFound'; message: string }
  | { kind: 'RepositoryError'; message: string }
  | { kind: 'StorageError'; message: string }
  | { kind: 'Forbidden'; reason: string };

@Injectable()
export class FilesService {
  constructor(
    private readonly uploadFile: UploadFileHandler,
    private readonly downloadFile: DownloadFileHandler,
  ) {}

  upload(
    req: UploadFileRequest,
  ): ResultAsync<UploadFileResponse, FilesServiceError> {
    return this.uploadFile.execute(req);
  }

  download(
    req: DownloadFileRequest,
  ): ResultAsync<DownloadFileResponse, FilesServiceError> {
    return this.downloadFile.execute(req);
  }
}
