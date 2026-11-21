import { Injectable } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';

import { FormsError } from '@/forms/domain/errors';
import { AccessDecision, FormAccess } from '@/forms/domain/form-access.policy';
import { FormRepository } from '@/forms/infra/repository/form.repository';
import { AuthenticatedUser } from '@/shared/domain/authenticated-user.entity';

export type StartFormReviewCommand = {
  actor: AuthenticatedUser;
  formId: string;
};

@Injectable()
export class StartFormReviewHandler {
  constructor(private readonly formRepository: FormRepository) {}

  execute(cmd: StartFormReviewCommand): ResultAsync<void, FormsError> {
    return this.formRepository
      .get(cmd.formId)
      .andThen((form) =>
        AccessDecision.toResult(
          FormAccess.canStartReview(form, cmd.actor),
          form,
        ),
      )
      .andThen((form) => form.startReview(cmd.actor.id).map(() => form))
      .andThen((form) => this.formRepository.update(form));
  }
}
