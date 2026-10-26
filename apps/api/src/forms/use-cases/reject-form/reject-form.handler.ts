import { Injectable } from '@nestjs/common';
import { FormRepository } from '../../infra/repository/form.repository';
import { err, ok, Result } from 'neverthrow';
import { FormsError } from '../../domain/errors';
import { AccessDecision, FormAccess } from '../../domain/form-access.policy';

export type RejectFormCommand = {
  formId: string;
  actorId: string;
  reason: string | null;
};

@Injectable()
export class RejectFormHandler {
  constructor(private readonly formRepository: FormRepository) {}

  async execute(cmd: RejectFormCommand): Promise<Result<void, FormsError>> {
    const formResult = await this.formRepository.get(cmd.formId);
    if (formResult.isErr()) return err(formResult.error);
    const form = formResult.value;

    const accessResult = AccessDecision.toResult(
      FormAccess.canReject(form, { actorId: cmd.actorId }),
      undefined,
    );
    if (accessResult.isErr()) return err(accessResult.error);

    const actResult = form.reject(cmd.reason);
    if (actResult.isErr()) return err(actResult.error);

    const saveResult = await this.formRepository.update(form);
    if (saveResult.isErr()) return err(saveResult.error);

    return ok();
  }
}
