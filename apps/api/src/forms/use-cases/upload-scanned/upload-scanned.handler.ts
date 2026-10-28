import { Inject, Injectable } from '@nestjs/common';
import { FormRepository } from '../../infra/repository/form.repository';
import { FormDocumentRepository } from '../../infra/repository/form-document.repository';
import { err, ok, Result } from 'neverthrow';
import { FormsError } from '../../domain/errors';
import { StorageService } from '../../infra/storage/storage.service';
import { UUID_PORT, type UuidPort } from '../../../shared/infra/uuid/uuid.port';
import {
  FormDocument,
  FormDocumentType,
} from '../../domain/form-document.entity';
import { AccessDecision, FormAccess } from '../../domain/form-access.policy';
import path from 'node:path';
import {
  UploadScannedCommand,
  UploadScannedResult,
} from './upload-scanned.data';

@Injectable()
export class UploadScannedHandler {
  constructor(
    private readonly formRepository: FormRepository,
    private readonly documentRepository: FormDocumentRepository,
    private readonly storage: StorageService,
    @Inject(UUID_PORT) private readonly uuid: UuidPort,
  ) {}

  async execute(
    cmd: UploadScannedCommand,
  ): Promise<Result<UploadScannedResult, FormsError>> {
    const formRes = await this.formRepository.get(cmd.formId);
    if (formRes.isErr()) return err(formRes.error);
    const form = formRes.value;

    const accRes = AccessDecision.toResult(
      FormAccess.canView(form, { actorId: cmd.actorId }),
      undefined,
    );
    if (accRes.isErr()) return err(accRes.error);

    const storageKey =
      'form-documents/' +
      this.uuid.generate() +
      path.extname(cmd.filename).toLowerCase();
    const uploadRes = await this.storage.upload(
      storageKey,
      cmd.body,
      cmd.contentType,
    );
    if (uploadRes.isErr()) return err(uploadRes.error);

    const document = FormDocument.create({
      id: this.uuid.generate(),
      formId: form.id,
      formRevision: 1, // TODO: form.revision
      type: FormDocumentType.Scanned,
      storageKey,
      contentType: cmd.contentType,
      createdBy: cmd.actorId,
    });
    const docRes = await this.documentRepository.save(document);
    if (docRes.isErr()) return err(docRes.error);

    return ok({ documentId: document.id });
  }
}
