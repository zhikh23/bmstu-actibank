import { ResultAsync } from 'neverthrow';
import { Readable } from 'node:stream';

export type StorageError =
  | { kind: 'NotFound'; message: string }
  | { kind: 'StorageError'; message: string };

export const StorageError = {
  notFound: (message: string): StorageError => ({
    kind: 'NotFound',
    message,
  }),

  internal: (message: string): StorageError => ({
    kind: 'StorageError',
    message,
  }),
};

export type StorageDownloadResult = {
  body: Readable;
  contentType?: string;
  contentLength?: number;
};

export interface StoragePort {
  upload(
    key: string,
    body: Buffer,
    contentType: string,
  ): ResultAsync<void, StorageError>;
  download(key: string): ResultAsync<StorageDownloadResult, StorageError>;
  delete(key: string): ResultAsync<void, StorageError>;
}
