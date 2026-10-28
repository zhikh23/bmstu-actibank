import { Injectable } from '@nestjs/common';
import { err, ok, Result } from 'neverthrow';
import { FormRepository } from '../../infra/repository/form.repository';
import { FormDocumentRepository } from '../../infra/repository/form-document.repository';
import { StorageService } from '../../infra/storage/storage.service';
import { FormsError } from '../../domain/errors';
import { AccessDecision, FormAccess } from '../../domain/form-access.policy';
import { ReadFileCommand, ReadFileResult } from './read-file.data';

@Injectable()
export class ReadFileHandler {
  constructor(
    private readonly formRepository: FormRepository,
    private readonly documentRepository: FormDocumentRepository,
    private readonly storage: StorageService,
  ) {}

  async execute(
    cmd: ReadFileCommand,
  ): Promise<Result<ReadFileResult, FormsError>> {
    const formResult = await this.formRepository.get(cmd.formId);
    if (formResult.isErr()) return err(formResult.error);

    const accessResult = AccessDecision.toResult(
      FormAccess.canView(formResult.value, {
        actorId: cmd.actorId,
        isModerator: cmd.isModerator,
      }),
      undefined,
    );
    if (accessResult.isErr()) return err(accessResult.error);

    const documentResult = await this.documentRepository.get(cmd.documentId);
    if (documentResult.isErr()) return err(documentResult.error);
    const document = documentResult.value;

    if (document.formId !== formResult.value.id) {
      return err(
        FormsError.notFound(
          `form document with id "${cmd.documentId}" not found`,
        ),
      );
    }

    const storageResult = await this.storage.download(document.storageKey);
    if (storageResult.isErr()) return err(storageResult.error);

    return ok({
      body: storageResult.value.body,
      contentType: document.contentType,
      contentLength: storageResult.value.contentLength,
    });
  }
}
