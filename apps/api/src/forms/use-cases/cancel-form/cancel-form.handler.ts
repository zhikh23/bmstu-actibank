import { Injectable } from '@nestjs/common';
import { FormRepository } from '../../infra/repository/form.repository';
import { ResultAsync } from 'neverthrow';
import { FormsError } from '../../domain/errors';
import { AccessDecision, FormAccess } from '../../domain/form-access.policy';
import { AuthenticatedUser } from '../../../shared/domain/authenticated-user.entity';

export type CancelFormCommand = {
  actor: AuthenticatedUser;
  formId: string;
};

@Injectable()
export class CancelFormHandler {
  constructor(private readonly repository: FormRepository) {}

  execute(cmd: CancelFormCommand): ResultAsync<void, FormsError> {
    return this.repository
      .get(cmd.formId)
      .andThen((form) =>
        AccessDecision.toResult(FormAccess.canCancel(form, cmd.actor), form),
      )
      .andThen((form) => form.cancel().map(() => form))
      .andThen((form) => this.repository.update(form));
  }
}
