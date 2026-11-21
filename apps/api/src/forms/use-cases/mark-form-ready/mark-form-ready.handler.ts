import { Injectable } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';

import { FormsError } from '@/forms/domain/errors';
import { AccessDecision, FormAccess } from '@/forms/domain/form-access.policy';
import { FormRepository } from '@/forms/infra/repository/form.repository';
import { AuthenticatedUser } from '@/shared/domain/authenticated-user.entity';

export type MarkFormReadyCommand = {
  actor: AuthenticatedUser;
  formId: string;
};

@Injectable()
export class MarkFormReadyHandler {
  constructor(private readonly formRepository: FormRepository) {}

  execute(cmd: MarkFormReadyCommand): ResultAsync<void, FormsError> {
    return this.formRepository
      .get(cmd.formId)
      .andThen((form) =>
        AccessDecision.toResult(FormAccess.canMarkReady(form, cmd.actor), form),
      )
      .andThen((form) => form.markReady().map(() => form))
      .andThen((form) => this.formRepository.update(form));
  }
}
