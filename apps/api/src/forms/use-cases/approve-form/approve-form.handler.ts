import { Injectable } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';

import { FormsError } from '@/forms/domain/errors';
import { AccessDecision, FormAccess } from '@/forms/domain/form-access.policy';
import { FormRepository } from '@/forms/infra/repository/form.repository';
import { AuthenticatedUser } from '@/shared/domain/authenticated-user.entity';
import { EventsService } from '@/events/external/events.service';
import { FormEntity } from '@/forms/domain/form.entity';
import { CreateEventInput } from '@/events/external/dto/create-event.input';
import { plainDateTimeToDate } from '@/shared/utils/dates';

export type ApproveFormCommand = {
  actor: AuthenticatedUser;
  formId: string;
};

@Injectable()
export class ApproveFormHandler {
  constructor(
    private readonly repository: FormRepository,
    private readonly events: EventsService,
  ) {}

  execute(cmd: ApproveFormCommand): ResultAsync<void, FormsError> {
    return this.repository
      .get(cmd.formId)
      .andThen((form) =>
        AccessDecision.toResult(FormAccess.canApprove(form, cmd.actor), form),
      )
      .andThen((form) => form.approve().map(() => form))
      .andThen((form) => this.repository.update(form).map(() => form))
      .map(this.mapFormToEvent)
      .andThen((data) => this.events.create(data).map(() => undefined));
  }

  private mapFormToEvent(f: FormEntity): CreateEventInput {
    return {
      ...f,
      start: plainDateTimeToDate(f.start),
      end: plainDateTimeToDate(f.end),
      formId: f.id,
      signedScanId: f.document!.scanId!,
      reviewedBy: f.reviewerId!,
    };
  }
}
