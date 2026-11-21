import { Inject, Injectable } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';

import { FilesService } from '@/files/export/files.service';
import { FormsError } from '@/forms/domain/errors';
import { FormDocumentEntity } from '@/forms/domain/form-document.entity';
import { IDocumentGeneratorPort } from '@/forms/infra/document-generator/document-generator.port';
import { DOCUMENT_GENERATOR_PORT } from '@/forms/infra/document-generator/document-generator.tokens';
import { FormRepository } from '@/forms/infra/repository/form.repository';
import { AuthenticatedUser } from '@/shared/domain/authenticated-user.entity';
import { UUID_PORT, UuidPort } from '@/shared/infra/uuid/uuid.port';

import { FormDocumentDataFactory } from './form-document-data.factory';

export type GenerateDocumentCommand = {
  actor: AuthenticatedUser;
  formId: string;
};

export type GenerateDocumentResult = {
  // ID сгенерированного файла.
  fileId: string;
};

@Injectable()
export class GenerateDocumentHandler {
  constructor(
    private readonly repository: FormRepository,
    private readonly filesService: FilesService,
    private readonly factory: FormDocumentDataFactory,
    @Inject(UUID_PORT)
    private readonly uuid: UuidPort,
    @Inject(DOCUMENT_GENERATOR_PORT)
    private readonly generator: IDocumentGeneratorPort,
  ) {}

  execute(
    cmd: GenerateDocumentCommand,
  ): ResultAsync<GenerateDocumentResult, FormsError> {
    return this.repository
      .get(cmd.formId)
      .andThen((form) => form.ensureSubmitter(cmd.actor.id).map(() => form))
      .andThen((form) =>
        this.factory.create(form).map((data) => ({ data, form })),
      )
      .andThen(({ data, form }) =>
        this.generator.generate(data).map((generated) => ({ generated, form })),
      )
      .andThen(({ generated, form }) =>
        this.filesService
          .upload({ actor: cmd.actor, ...generated })
          .map((file) => ({ file, form })),
      )
      .andThen(({ file, form }) => {
        const document = FormDocumentEntity.create({
          id: this.uuid.generate(),
          generatedId: file.fileId,
        });
        return form
          .attachDocument(document)
          .asyncAndThen(() => this.repository.update(form))
          .map(() => file);
      });
  }
}
