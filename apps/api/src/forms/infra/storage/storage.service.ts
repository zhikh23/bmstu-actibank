import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { S3_CLIENT } from './storage.tokens';
import { Readable } from 'node:stream';
import { errAsync, okAsync, ResultAsync } from 'neverthrow';
import { FormsError } from '../../domain/errors';

export type StoredObject = {
  body: Readable;
  contentType?: string;
  contentLength?: number;
};

@Injectable()
export class StorageService {
  private readonly bucket: string;

  constructor(
    @Inject(S3_CLIENT) private readonly s3: S3Client,
    config: ConfigService,
  ) {
    this.bucket = config.getOrThrow('S3_BUCKET_NAME');
  }

  upload(
    key: string,
    body: Buffer | Readable,
    contentType: string,
  ): ResultAsync<void, FormsError> {
    return ResultAsync.fromPromise(
      this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: body,
          ContentType: contentType,
        }),
      ),
      (error): FormsError =>
        FormsError.storageError(
          error instanceof Error ? error.message : String(error),
        ),
    ).map(() => undefined);
  }

  download(key: string): ResultAsync<StoredObject, FormsError> {
    return ResultAsync.fromPromise(
      this.s3.send(
        new GetObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      ),
      (error): FormsError =>
        FormsError.storageError(
          error instanceof Error ? error.message : String(error),
        ),
    ).andThen((object) =>
      object.Body instanceof Readable
        ? okAsync({
            body: object.Body,
            contentType: object.ContentType,
            contentLength: object.ContentLength,
          })
        : errAsync(
            FormsError.storageError(`storage object "${key}" not found`),
          ),
    );
  }

  delete(key: string): ResultAsync<void, FormsError> {
    return ResultAsync.fromPromise(
      this.s3.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      ),
      (error): FormsError =>
        FormsError.storageError(
          error instanceof Error ? error.message : String(error),
        ),
    ).map(() => undefined);
  }

  exists(key: string): ResultAsync<boolean, FormsError> {
    return (
      ResultAsync.fromPromise(
        this.s3.send(
          new HeadObjectCommand({
            Bucket: this.bucket,
            Key: key,
          }),
        ),
        (error): FormsError =>
          FormsError.storageError(
            error instanceof Error ? error.message : String(error),
          ),
      )
        .map(() => true)
        // На самом деле тут любая ошибка означает, что объект не найден.
        // Но пока что не будем различать ошибки, чтобы не усложнять код.
        // В будущем такую проверку добавить будет необходимым.
        .orElse(() => okAsync(false))
    );
  }
}
