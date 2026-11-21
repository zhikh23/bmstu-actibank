import { Injectable } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';

import { FormsError } from '@/forms/domain/errors';
import {
  FormRepository,
  GetAllFormsQuery,
} from '@/forms/infra/repository/form.repository';
import { UserRole } from '@/shared/domain/authenticated-user.entity';
import { instantToDate, plainDateTimeToDate } from '@/shared/utils/dates';

import { FormSummary, ListFormsQuery } from './list-forms.data';

@Injectable()
export class ListFormsHandler {
  constructor(private readonly repository: FormRepository) {}

  execute(q: ListFormsQuery): ResultAsync<FormSummary[], FormsError> {
    const query: GetAllFormsQuery = {
      actorId: q.actor.id,
      isModerator: q.actor.roles.includes(UserRole.Moderator),
      status: q.status,
      sortBy: q.sortBy,
      sortOrder: q.sortOrder,
    };

    return this.repository.getAll(query).map((forms) =>
      forms.map((form) => ({
        id: form.id,
        slug: form.slug,
        name: form.name,
        description: form.description,
        start: plainDateTimeToDate(form.start),
        end: plainDateTimeToDate(form.end),
        status: form.status,
        submitterId: form.submitterId,
        createdAt: instantToDate(form.createdAt),
      })),
    );
  }
}
