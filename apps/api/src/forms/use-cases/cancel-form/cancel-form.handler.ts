import { Injectable } from '@nestjs/common';
import { FormRepository } from '../../infra/repository/form.repository';
import { err, ok, Result } from 'neverthrow';
import { FormsError } from '../../domain/errors';
import { AccessDecision, FormAccess } from '../../domain/form-access.policy';
import { AuthenticatedUser } from '../../../shared/domain/authenticated-user.entity';

export type CancelFormCommand = {
  actor: AuthenticatedUser;
  formId: string;
};

@Injectable()
export class CancelFormHandler {
  constructor(private readonly formRepository: FormRepository) {}

  async execute(cmd: CancelFormCommand): Promise<Result<void, FormsError>> {
    const formResult = await this.formRepository.get(cmd.formId);
    if (formResult.isErr()) return err(formResult.error);
    const form = formResult.value;

    const accessResult = AccessDecision.toResult(
      FormAccess.canCancel(form, cmd.actor),
      undefined,
    );
    if (accessResult.isErr()) return err(accessResult.error);

    const actResult = form.cancel();
    if (actResult.isErr()) return err(actResult.error);

    const saveResult = await this.formRepository.update(form);
    if (saveResult.isErr()) return err(saveResult.error);

    return ok();
  }
}
