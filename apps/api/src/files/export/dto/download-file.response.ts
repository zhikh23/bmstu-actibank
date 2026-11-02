import { Readable } from 'node:stream';

export type DownloadFileResponse = {
  body: Readable;
  filename: string;
  contentType: string;
  contentLength: number;
};
