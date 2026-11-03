import { Injectable } from '@nestjs/common';
import { FormRepository } from '../../infra/repository/form.repository';
import { ResultAsync } from 'neverthrow';
import { FormsError } from '../../domain/errors';
import { AccessDecision, FormAccess } from '../../domain/form-access.policy';
import { AuthenticatedUser } from '../../../shared/domain/authenticated-user.entity';

export type RejectFormCommand = {
  actor: AuthenticatedUser;
  formId: string;
  reason: string | null;
};

@Injectable()
export class RejectFormHandler {
  constructor(private readonly formRepository: FormRepository) {}

  execute(cmd: RejectFormCommand): ResultAsync<void, FormsError> {
    return this.formRepository
      .get(cmd.formId)
      .andThen((form) =>
        AccessDecision.toResult(FormAccess.canReject(form, cmd.actor), form),
      )
      .andThen((form) => form.reject(cmd.reason).map(() => form))
      .andThen((form) => this.formRepository.update(form));
  }
}
