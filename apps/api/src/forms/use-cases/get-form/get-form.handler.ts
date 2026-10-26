import { Injectable } from '@nestjs/common';
import { Result, err } from 'neverthrow';
import { FormRepository } from '../../infra/repository/form.repository';
import { FormsError } from '../../domain/errors';
import { AccessDecision, FormAccess } from '../../domain/form-access.policy';
import {
  instantToDate,
  plainDateTimeToDate,
} from '../../../shared/utils/dates';
import { FormType } from './get-form.data';
import { VenueProvider } from '../../../catalog/external/venue-provider/venue-provider.service';
import { ThemeProvider } from '../../../catalog/external/theme-provider/theme-provider.service';
import { EventTypeProvider } from '../../../catalog/external/event-type-provider/event-type-provider.service';
import { FormatProvider } from '../../../catalog/external/format-provider/format-provider.service';
import { LevelProvider } from '../../../catalog/external/level-provider/level-provider.service';
import { RoleProvider } from '../../../catalog/external/role-provider/role-provider.service';
import { OrganizationProvider } from '../../../catalog/external/organization-provider/organization-provider.service';
import { RankProvider } from '../../../catalog/external/rank-provider/rank-provider.service';

export type GetFormCommand = {
  id: string;
  actorId: string;
};

@Injectable()
export class GetFormHandler {
  constructor(
    private readonly formRepository: FormRepository,
    private readonly eventTypeProvider: EventTypeProvider,
    private readonly formatProvider: FormatProvider,
    private readonly levelProvider: LevelProvider,
    private readonly venueProvider: VenueProvider,
    private readonly themeProvider: ThemeProvider,
    private readonly roleProvider: RoleProvider,
    private readonly organizationProvider: OrganizationProvider,
    private readonly rankProvider: RankProvider,
  ) {}

  async execute(cmd: GetFormCommand): Promise<Result<FormType, FormsError>> {
    const getResult = await this.formRepository.get(cmd.id);
    if (getResult.isErr()) {
      return err(getResult.error);
    }
    const form = getResult.value;

    const organizations = await Promise.all(
      form.organizers.map(async (id) =>
        (await this.organizationProvider.getOrganization(id)).unwrapOr({
          id,
          name: '',
          category: { id: '', name: '' },
        }),
      ),
    );

    const venuesResult = await this.venueProvider.getVenues(form.venues);
    if (venuesResult.isErr()) return err(venuesResult.error);
    const venues = venuesResult.value;

    const themesResult = await this.themeProvider.getThemes(form.themes);
    if (themesResult.isErr()) return err(themesResult.error);
    const themes = themesResult.value;

    const ranksResult = await this.rankProvider.getRanks(
      form.guests.map((g) => g.rankId),
    );
    if (ranksResult.isErr()) return err(ranksResult.error);
    const ranksMap = new Map(ranksResult.value.map((rank) => [rank.id, rank]));

    const format = (
      await this.formatProvider.getFormat(form.formatId)
    ).unwrapOr({
      id: form.formatId,
      label: '',
    });

    const eventType = (
      await this.eventTypeProvider.getEventType(form.typeId)
    ).unwrapOr({
      id: form.typeId,
      label: '',
    });

    const level = (await this.levelProvider.getLevel(form.levelId)).unwrapOr({
      id: form.levelId,
      label: '',
    });

    const rolesResult = await this.roleProvider.getRoles(
      form.team.map((m) => m.roleId),
    );
    if (rolesResult.isErr()) return err(rolesResult.error);
    const rolesMap = new Map(rolesResult.value.map((r) => [r.id, r]));

    return AccessDecision.toResult(
      FormAccess.canView(form, { actorId: cmd.actorId }),
      {
        id: form.id,
        name: form.name,
        description: form.description,
        organizers: organizations,
        links: form.links,
        venues: venues,
        themes: themes,
        start: plainDateTimeToDate(form.start),
        end: plainDateTimeToDate(form.end),
        format: format,
        type: eventType,
        level: level,
        participants: {
          students: form.participants.students,
          employees: form.participants.employees,
          others: form.participants.others,
        },
        guests: form.guests.map((g) => ({
          userId: g.userId,
          rank: ranksMap.get(g.rankId) ?? { id: g.rankId, title: '' },
        })),
        team: form.team.map((t) => ({
          userId: t.userId,
          role: {
            id: t.roleId,
            label: rolesMap.get(t.roleId)?.label ?? '',
            category: rolesMap.get(t.roleId)?.category ?? {
              id: '',
              label: '',
            },
          },
        })),
        status: form.status,
        reason: form.reason,
        submitterId: form.submitterId,
        reviewerId: form.reviewerId,
        createdAt: instantToDate(form.createdAt),
        updatedAt: instantToDate(form.updatedAt),
        reviewedAt: form.reviewedAt ? instantToDate(form.reviewedAt) : null,
        canceledAt: form.canceledAt ? instantToDate(form.canceledAt) : null,
      },
    );
  }
}
