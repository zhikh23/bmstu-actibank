import { Injectable } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';

import { FormsError } from '@/forms/domain/errors';
import { AccessDecision, FormAccess } from '@/forms/domain/form-access.policy';
import { FormRepository } from '@/forms/infra/repository/form.repository';
import { AuthenticatedUser } from '@/shared/domain/authenticated-user.entity';

export type ApproveFormCommand = {
  actor: AuthenticatedUser;
  formId: string;
};

@Injectable()
export class ApproveFormHandler {
  constructor(private readonly repository: FormRepository) {}

  execute(cmd: ApproveFormCommand): ResultAsync<void, FormsError> {
    return this.repository
      .get(cmd.formId)
      .andThen((form) =>
        AccessDecision.toResult(FormAccess.canApprove(form, cmd.actor), form),
      )
      .andThen((form) => form.approve().map(() => form))
      .andThen((form) => this.repository.update(form));
  }
}
