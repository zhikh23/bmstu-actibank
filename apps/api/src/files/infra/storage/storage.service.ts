import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { errAsync, okAsync, ResultAsync } from 'neverthrow';
import { Readable } from 'stream';

import {
  StorageDownloadResult,
  StorageError,
  StoragePort,
} from './storage.port';
import { S3_CLIENT } from './storage.tokens';

@Injectable()
export class StorageService implements StoragePort {
  private readonly bucket: string;

  constructor(
    @Inject(S3_CLIENT) private readonly s3: S3Client,
    config: ConfigService,
  ) {
    this.bucket = config.getOrThrow('S3_BUCKET_NAME');
  }

  upload(
    key: string,
    body: Buffer,
    contentType: string,
  ): ResultAsync<void, StorageError> {
    return ResultAsync.fromPromise(
      this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: body,
          ContentType: contentType,
        }),
      ),
      (error): StorageError =>
        StorageError.internal(
          error instanceof Error ? error.message : String(error),
        ),
    ).map(() => undefined);
  }

  download(key: string): ResultAsync<StorageDownloadResult, StorageError> {
    return ResultAsync.fromPromise(
      this.s3.send(
        new GetObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      ),
      (error): StorageError =>
        StorageError.internal(
          error instanceof Error ? error.message : String(error),
        ),
    ).andThen((object) =>
      object.Body instanceof Readable
        ? okAsync({
            body: object.Body,
            contentType: object.ContentType,
            contentLength: object.ContentLength,
          })
        : errAsync(StorageError.internal(`storage object "${key}" not found`)),
    );
  }

  delete(key: string): ResultAsync<void, StorageError> {
    return ResultAsync.fromPromise(
      this.s3.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      ),
      (error): StorageError =>
        StorageError.internal(
          error instanceof Error ? error.message : String(error),
        ),
    ).map(() => undefined);
  }
}
