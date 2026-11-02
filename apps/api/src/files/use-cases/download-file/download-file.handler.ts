import { Inject, Injectable } from '@nestjs/common';
import { FileRepository } from '../../infra/repository/file.repository';
import { STORAGE_PORT } from '../../infra/storage/storage.tokens';
import { StoragePort } from '../../infra/storage/storage.port';
import { DownloadFileCommand, DownloadFileResult } from './download-file.data';
import { err, ok, Result, ResultAsync } from 'neverthrow';
import { FilesError } from '../../domain/errors';
import {
  AuthenticatedUser,
  UserRole,
} from '../../../shared/domain/authenticated-user.entity';
import { File } from '../../domain/file.entity';

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
