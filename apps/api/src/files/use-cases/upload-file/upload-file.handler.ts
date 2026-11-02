import { Inject, Injectable } from '@nestjs/common';
import { FileRepository } from '../../infra/repository/file.repository';
import { UUID_PORT, UuidPort } from '../../../shared/infra/uuid/uuid.port';
import { STORAGE_PORT } from '../../infra/storage/storage.tokens';
import { StoragePort } from '../../infra/storage/storage.port';
import { ResultAsync } from 'neverthrow';
import { FilesError } from '../../domain/errors';
import path from 'node:path';
import { UploadFileCommand, UploadFileResult } from './upload-file.data';
import { File } from '../../domain/file.entity';

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
