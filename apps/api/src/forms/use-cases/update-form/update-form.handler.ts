import { Injectable } from '@nestjs/common';
import { FormRepository } from '../../infra/repository/form.repository';
import { AuthenticatedUser } from '../../../shared/domain/authenticated-user.entity';
import { okAsync, ResultAsync } from 'neverthrow';
import { FormType } from '../get-form/get-form.data';
import { FormsError } from '../../domain/errors';
import { AccessDecision, FormAccess } from '../../domain/form-access.policy';
import { Participants } from '../../domain/participants.entity';
import { Guest } from '../../domain/guest.entity';
import { Member } from '../../domain/member.entity';
import {
  instantToDate,
  plainDateTimeToDate,
} from '../../../shared/utils/dates';
import { CatalogService } from '../../../catalog/external/catalog.service';
import { FormUpdate } from '../../domain/form.entity';

export type UpdateFormCommand = {
  actor: AuthenticatedUser;
  id: string;
  name?: string;
  description?: string;
  organizers?: string[];
  links?: string[];
  venues?: string[];
  themes?: string[];
  start?: string;
  end?: string;
  formatId?: string;
  typeId?: string;
  levelId?: string;
  participants?: {
    students: number;
    employees: number;
    others: number;
  };
  guests?: {
    userId: string;
    rankId: string;
  }[];
  team?: {
    userId: string;
    roleId: string;
  }[];
};

@Injectable()
export class UpdateFormHandler {
  constructor(
    private readonly repository: FormRepository,
    private readonly catalog: CatalogService,
  ) {}

  execute(cmd: UpdateFormCommand): ResultAsync<FormType, FormsError> {
    return this.repository
      .get(cmd.id)
      .andThen((form) =>
        AccessDecision.toResult(FormAccess.canUpdate(form, cmd.actor), form),
      )
      .andThen((form) => form.update(this.toFormUpdate(cmd)))
      .andThen((form) => this.repository.update(form).map(() => form))
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
          document: null, // Гарантировано будет null из-за инвалидации документа
          createdAt: instantToDate(form.createdAt),
          updatedAt: instantToDate(form.updatedAt),
          reviewedAt: form.reviewedAt ? instantToDate(form.reviewedAt) : null,
          canceledAt: form.canceledAt ? instantToDate(form.canceledAt) : null,
        }),
      );
  }

  private toFormUpdate(cmd: UpdateFormCommand): FormUpdate {
    const changes: FormUpdate = {};

    if (cmd.name !== undefined) changes.name = cmd.name;
    if (cmd.description !== undefined) changes.description = cmd.description;
    if (cmd.organizers !== undefined) changes.organizers = cmd.organizers;
    if (cmd.links !== undefined) changes.links = cmd.links;
    if (cmd.venues !== undefined) changes.venues = cmd.venues;
    if (cmd.themes !== undefined) changes.themes = cmd.themes;
    if (cmd.start !== undefined) {
      changes.start = Temporal.PlainDateTime.from(cmd.start);
    }
    if (cmd.end !== undefined) {
      changes.end = Temporal.PlainDateTime.from(cmd.end);
    }
    if (cmd.formatId !== undefined) changes.formatId = cmd.formatId;
    if (cmd.typeId !== undefined) changes.typeId = cmd.typeId;
    if (cmd.levelId !== undefined) changes.levelId = cmd.levelId;
    if (cmd.participants !== undefined) {
      changes.participants = new Participants(
        cmd.participants.students,
        cmd.participants.employees,
        cmd.participants.others,
      );
    }
    if (cmd.guests !== undefined) {
      changes.guests = cmd.guests.map((g) => new Guest(g.userId, g.rankId));
    }
    if (cmd.team !== undefined) {
      changes.team = cmd.team.map((m) => new Member(m.userId, m.roleId));
    }

    return changes;
  }
}
