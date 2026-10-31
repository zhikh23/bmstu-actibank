import { Readable } from 'node:stream';

export type DownloadFileCommand = {
  fileId: string;
  actorId: string;
  isModerator: boolean;
};

export type DownloadFileResult = {
  body: Readable;
  filename: string;
  contentType: string;
  contentLength: number;
};
