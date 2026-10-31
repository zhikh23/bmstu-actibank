import { Readable } from 'node:stream';
import { AuthenticatedUser } from '../../../shared/domain/authenticated-user.entity';

export type DownloadFileCommand = {
  actor: AuthenticatedUser;
  fileId: string;
};

export type DownloadFileResult = {
  body: Readable;
  filename: string;
  contentType: string;
  contentLength: number;
};
