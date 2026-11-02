import { Injectable } from '@nestjs/common';
import { UploadFileHandler } from '../use-cases/upload-file/upload-file.handler';
import { DownloadFileHandler } from '../use-cases/download-file/download-file.handler';
import { ResultAsync } from 'neverthrow';
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
