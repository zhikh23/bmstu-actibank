import { Injectable } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';

import { FormsError } from '@/forms/domain/errors';
import { AccessDecision, FormAccess } from '@/forms/domain/form-access.policy';
import { FormRepository } from '@/forms/infra/repository/form.repository';
import { AuthenticatedUser } from '@/shared/domain/authenticated-user.entity';

export type ConvertToDraftFormCommand = {
  actor: AuthenticatedUser;
  formId: string;
  reason: string | null;
};

@Injectable()
export class ConvertToDraftFormHandler {
  constructor(private readonly formRepository: FormRepository) {}

  execute(cmd: ConvertToDraftFormCommand): ResultAsync<void, FormsError> {
    return this.formRepository
      .get(cmd.formId)
      .andThen((form) =>
        AccessDecision.toResult(
          FormAccess.canConvertToDraft(form, cmd.actor),
          form,
        ),
      )
      .andThen((form) => form.convertToDraft(cmd.reason).map(() => form))
      .andThen((form) => this.formRepository.update(form));
  }
}
