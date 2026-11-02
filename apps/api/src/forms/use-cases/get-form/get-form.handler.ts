import { Injectable } from '@nestjs/common';
import { Result, ResultAsync, okAsync } from 'neverthrow';
import { FormRepository } from '../../infra/repository/form.repository';
import { FormsError } from '../../domain/errors';
import { AccessDecision, FormAccess } from '../../domain/form-access.policy';
import {
  instantToDate,
  plainDateTimeToDate,
} from '../../../shared/utils/dates';
import { FormType } from './get-form.data';
import { AuthenticatedUser } from '../../../shared/domain/authenticated-user.entity';
import { CatalogService } from '../../../catalog/external/catalog.service';

export type GetFormCommand = {
  actor: AuthenticatedUser;
  formId: string;
};

@Injectable()
export class GetFormHandler {
  constructor(
    private readonly repository: FormRepository,
    private readonly catalog: CatalogService,
  ) {}

  async execute(cmd: GetFormCommand): Promise<Result<FormType, FormsError>> {
    return this.repository
      .get(cmd.formId)
      .andThen((form) =>
        AccessDecision.toResult(FormAccess.canView(form, cmd.actor), form),
      )
      .andThen((form) => {
        return ResultAsync.combine([
          okAsync(form),
          this.catalog.getOrganizations(form.organizers),
          this.catalog.getVenues(form.venues),
          this.catalog.getThemes(form.themes),
          this.catalog.getFormat(form.formatId),
          this.catalog.getEventType(form.typeId),
          this.catalog.getLevel(form.levelId),
          this.catalog.getRanks(form.guests.map((g) => g.rankId)),
          this.catalog.getRoles(form.team.map((t) => t.roleId)),
        ]);
      })
      .map(
        ([
          form,
          organizers,
          venues,
          themes,
          format,
          type,
          level,
          ranks,
          roles,
        ]) => ({
          id: form.id,
          name: form.name,
          description: form.description,
          organizers,
          links: form.links,
          venues,
          themes,
          start: plainDateTimeToDate(form.start),
          end: plainDateTimeToDate(form.end),
          format,
          type,
          level,
          participants: form.participants,
          guests: form.guests.map((g) => ({
            userId: g.userId,
            rank: ranks.find((r) => r.id === g.rankId) ?? {
              id: g.rankId,
              name: '',
            },
          })),
          team: form.team.map((t) => ({
            userId: t.userId,
            role: roles.find((r) => r.id === t.roleId) ?? {
              id: t.roleId,
              name: '',
              category: { id: '', name: '' },
            },
          })),
          status: form.status,
          reason: form.reason,
          submitterId: form.submitterId,
          reviewerId: form.reviewerId,
          document: form.document
            ? {
                id: form.document.id,
                generatedId: form.document.generatedId,
                scanId: form.document.scanId,
                createdAt: instantToDate(form.document.createdAt),
                uploadedAt: form.document.uploadedAt
                  ? instantToDate(form.document.uploadedAt)
                  : null,
              }
            : null,
          createdAt: instantToDate(form.createdAt),
          updatedAt: instantToDate(form.updatedAt),
          reviewedAt: form.reviewedAt ? instantToDate(form.reviewedAt) : null,
          canceledAt: form.canceledAt ? instantToDate(form.canceledAt) : null,
        }),
      );
  }
}
