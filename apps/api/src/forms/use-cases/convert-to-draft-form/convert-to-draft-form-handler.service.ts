import { Injectable } from '@nestjs/common';
import { FormRepository } from '../../infra/repository/form.repository';
import { ResultAsync } from 'neverthrow';
import { FormsError } from '../../domain/errors';
import { AccessDecision, FormAccess } from '../../domain/form-access.policy';
import { AuthenticatedUser } from '../../../shared/domain/authenticated-user.entity';

export type ConvertToDraftFormCommand = {
  actor: AuthenticatedUser;
  formId: string;
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
      .andThen((form) => form.convertToDraft().map(() => form))
      .andThen((form) => this.formRepository.update(form));
  }
}
