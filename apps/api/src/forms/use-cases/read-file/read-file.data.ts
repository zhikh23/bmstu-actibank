import { Readable } from 'node:stream';

export type ReadFileCommand = {
  formId: string;
  documentId: string;
  actorId: string;
  isModerator?: boolean;
};

export type ReadFileResult = {
  body: Readable;
  contentType: string;
  contentLength?: number;
};
