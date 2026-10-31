import { Inject, Injectable } from '@nestjs/common';
import { FileRepository } from '../../infra/repository/file.repository';
import { STORAGE_PORT } from '../../infra/storage/storage.tokens';
import { StoragePort } from '../../infra/storage/storage.port';
import { DownloadFileCommand, DownloadFileResult } from './download-file.data';
import { err, ok, Result } from 'neverthrow';
import { FilesError } from '../../domain/errors';

@Injectable()
export class DownloadFileHandler {
  constructor(
    private readonly repository: FileRepository,
    @Inject(STORAGE_PORT) private readonly storage: StoragePort,
  ) {}

  async execute(
    cmd: DownloadFileCommand,
  ): Promise<Result<DownloadFileResult, FilesError>> {
    const fileRes = await this.repository.get(cmd.fileId);
    if (fileRes.isErr()) return err(fileRes.error);
    const file = fileRes.value;

    if (!cmd.isModerator && cmd.actorId != file.ownerId) {
      return err(
        FilesError.forbidden('file can be viewed only by owner or moderator'),
      );
    }

    const downloadRes = await this.storage.download(file.storageKey);
    if (downloadRes.isErr()) return err(downloadRes.error);
    const data = downloadRes.value;

    return ok({
      body: data.body,
      filename: file.storageKey.split('/').pop() ?? file.storageKey,
      contentType: data.contentType ?? file.contentType,
      contentLength: data.contentLength ?? file.size,
    });
  }
}
