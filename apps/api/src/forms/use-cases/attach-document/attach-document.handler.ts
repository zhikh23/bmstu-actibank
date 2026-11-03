import { Injectable } from '@nestjs/common';
import { FormRepository } from '../../infra/repository/form.repository';
import { ResultAsync } from 'neverthrow';
import { FormsError } from '../../domain/errors';

export type AttachDocumentCommand = {
  actorId: string;
  formId: string;
  fileId: string;
};

@Injectable()
export class AttachDocumentHandler {
  constructor(private readonly repository: FormRepository) {}

  execute(cmd: AttachDocumentCommand): ResultAsync<void, FormsError> {
    return this.repository
      .get(cmd.formId)
      .andThen((form) => form.ensureSubmitter(cmd.actorId).map(() => form))
      .andThen((form) =>
        form
          .ensureHasDocument()
          .map((document) => document.attach(cmd.fileId))
          .map(() => form),
      )
      .andThen((form) => this.repository.update(form));
  }
}
