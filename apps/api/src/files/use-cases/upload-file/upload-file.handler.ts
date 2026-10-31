import { Inject, Injectable } from '@nestjs/common';
import { FileRepository } from '../../infra/repository/file.repository';
import { UUID_PORT, UuidPort } from '../../../shared/infra/uuid/uuid.port';
import { STORAGE_PORT } from '../../infra/storage/storage.tokens';
import { StoragePort } from '../../infra/storage/storage.port';
import { err, ok, Result } from 'neverthrow';
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

  async execute(
    cmd: UploadFileCommand,
  ): Promise<Result<UploadFileResult, FilesError>> {
    const storageKey =
      'files/' +
      this.uuid.generate() +
      path.extname(cmd.filename).toLowerCase();
    const uploadRes = await this.storage.upload(
      storageKey,
      cmd.body,
      cmd.contentType,
    );
    if (uploadRes.isErr()) return err(uploadRes.error);

    const file = File.create({
      id: this.uuid.generate(),
      ownerId: cmd.actor.id,
      storageKey,
      contentType: cmd.contentType,
      size: cmd.body.length,
    });
    const saveRes = await this.repository.save(file);
    if (saveRes.isErr()) return err(saveRes.error);

    return ok({
      fileId: file.id,
    });
  }
}
