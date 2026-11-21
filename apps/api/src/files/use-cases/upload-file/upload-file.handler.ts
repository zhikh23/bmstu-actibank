import { Inject, Injectable } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';
import path from 'node:path';

import { FilesError } from '@/files/domain/errors';
import { File } from '@/files/domain/file.entity';
import { FileRepository } from '@/files/infra/repository/file.repository';
import { StoragePort } from '@/files/infra/storage/storage.port';
import { STORAGE_PORT } from '@/files/infra/storage/storage.tokens';
import { UUID_PORT, UuidPort } from '@/shared/infra/uuid/uuid.port';

import { UploadFileCommand, UploadFileResult } from './upload-file.data';

@Injectable()
export class UploadFileHandler {
  constructor(
    private readonly repository: FileRepository,
    @Inject(STORAGE_PORT) private readonly storage: StoragePort,
    @Inject(UUID_PORT) private readonly uuid: UuidPort,
  ) {}

  execute(cmd: UploadFileCommand): ResultAsync<UploadFileResult, FilesError> {
    const storageKey =
      'files/' +
      this.uuid.generate() +
      path.extname(cmd.filename).toLowerCase();

    return this.storage
      .upload(storageKey, cmd.body, cmd.contentType)
      .map(() =>
        File.create({
          id: this.uuid.generate(),
          ownerId: cmd.actor.id,
          storageKey,
          filename: cmd.filename,
          contentType: cmd.contentType,
          size: cmd.body.length,
        }),
      )
      .andThen((file) => this.repository.save(file))
      .map((file) => ({
        fileId: file.id,
      }));
  }
}
