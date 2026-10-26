import { Injectable } from '@nestjs/common';
import { FormRepository } from '../../infra/repository/form.repository';
import { err, ok, Result } from 'neverthrow';
import { FormsError } from '../../domain/errors';
import { AccessDecision, FormAccess } from '../../domain/form-access.policy';

export type MarkFormReadyCommand = {
  formId: string;
  actorId: string;
};

@Injectable()
export class MarkFormReadyHandler {
  constructor(private readonly formRepository: FormRepository) {}

  async execute(cmd: MarkFormReadyCommand): Promise<Result<void, FormsError>> {
    const formResult = await this.formRepository.get(cmd.formId);
    if (formResult.isErr()) return err(formResult.error);
    const form = formResult.value;

    const accessResult = AccessDecision.toResult(
      FormAccess.canMarkReady(form, { actorId: cmd.actorId }),
      undefined,
    );
    if (accessResult.isErr()) return err(accessResult.error);

    const actResult = form.markReady();
    if (actResult.isErr()) return err(actResult.error);

    const saveResult = await this.formRepository.update(form);
    if (saveResult.isErr()) return err(saveResult.error);

    return ok();
  }
}
