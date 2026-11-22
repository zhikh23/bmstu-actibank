import { Inject, Injectable } from '@nestjs/common';
import { Result, ResultAsync, err, ok } from 'neverthrow';

import { FilesError } from '@/files/domain/errors';
import { File } from '@/files/domain/file.entity';
import { FileRepository } from '@/files/infra/repository/file.repository';
import { StoragePort } from '@/files/infra/storage/storage.port';
import { STORAGE_PORT } from '@/files/infra/storage/storage.tokens';
import {
  AuthenticatedUser,
  UserRole,
} from '@/shared/domain/authenticated-user.entity';

import { DownloadFileCommand, DownloadFileResult } from './download-file.data';

@Injectable()
export class DownloadFileHandler {
  constructor(
    private readonly repository: FileRepository,
    @Inject(STORAGE_PORT) private readonly storage: StoragePort,
  ) {}

  execute(
    cmd: DownloadFileCommand,
  ): ResultAsync<DownloadFileResult, FilesError> {
    return this.repository
      .get(cmd.fileId)
      .andThen((file) => this.ensureCanViewFile(file, cmd.actor))
      .andThen((file) =>
        this.storage.download(file.storageKey).map((data) => ({ data, file })),
      )
      .map(({ data, file }) => ({
        body: data.body,
        filename: file.filename,
        contentType: data.contentType ?? file.contentType,
        contentLength: data.contentLength ?? file.size,
      }));
  }

  private ensureCanViewFile(
    file: File,
    actor: AuthenticatedUser,
  ): Result<File, FilesError> {
    if (!actor.roles.includes(UserRole.Moderator) && actor.id != file.ownerId) {
      return err(
        FilesError.forbidden('file can be viewed only by owner or moderator'),
      );
    }
    return ok(file);
  }
}
