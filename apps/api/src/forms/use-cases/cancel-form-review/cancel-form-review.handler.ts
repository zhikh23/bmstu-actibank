import { Injectable } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';

import { FormsError } from '@/forms/domain/errors';
import { AccessDecision, FormAccess } from '@/forms/domain/form-access.policy';
import { FormRepository } from '@/forms/infra/repository/form.repository';
import { AuthenticatedUser } from '@/shared/domain/authenticated-user.entity';

export type CancelFormReviewCommand = {
  actor: AuthenticatedUser;
  formId: string;
};

@Injectable()
export class CancelFormReviewHandler {
  constructor(private readonly repository: FormRepository) {}

  execute(cmd: CancelFormReviewCommand): ResultAsync<void, FormsError> {
    return this.repository
      .get(cmd.formId)
      .andThen((form) =>
        AccessDecision.toResult(
          FormAccess.canCancelReview(form, cmd.actor),
          form,
        ),
      )
      .andThen((form) => form.cancelReview().map(() => form))
      .andThen((form) => this.repository.update(form));
  }
}
