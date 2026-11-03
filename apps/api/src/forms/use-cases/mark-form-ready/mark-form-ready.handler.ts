import { Injectable } from '@nestjs/common';
import { FormRepository } from '../../infra/repository/form.repository';
import { ResultAsync } from 'neverthrow';
import { FormsError } from '../../domain/errors';
import { AccessDecision, FormAccess } from '../../domain/form-access.policy';
import { AuthenticatedUser } from '../../../shared/domain/authenticated-user.entity';

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
