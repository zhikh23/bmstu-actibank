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
import { VenueProvider } from '../../../events/external/venue-provider/venue-provider.service';

export type GetFormCommand = {
  id: string;
  actorId: string;
};

@Injectable()
export class GetFormHandler {
  constructor(
    private readonly formRepository: FormRepository,
    private readonly venueProvider: VenueProvider,
  ) {}

  async execute(cmd: GetFormCommand): Promise<Result<FormType, FormsError>> {
    const getResult = await this.formRepository.get(cmd.id);
    if (getResult.isErr()) {
      return err(getResult.error);
    }
    const form = getResult.value;

    const venuesResult = await this.venueProvider.getVenues(form.venues);
    if (venuesResult.isErr()) return err(venuesResult.error);
    const venues = venuesResult.value;

    return AccessDecision.toResult(
      FormAccess.canView(form, { actorId: cmd.actorId }),
      {
        id: form.id,
        name: form.name,
        description: form.description,
        organizers: form.organizers,
        links: form.links,
        venues: venues,
        themes: form.themes,
        start: plainDateTimeToDate(form.start),
        end: plainDateTimeToDate(form.end),
        formatId: form.formatId,
        typeId: form.typeId,
        levelId: form.levelId,
        participants: {
          students: form.participants.students,
          employees: form.participants.employees,
          others: form.participants.others,
        },
        guests: form.guests.map((g) => ({
          userId: g.userId,
          rankId: g.rankId,
        })),
        team: form.team.map((t) => ({
          userId: t.userID,
          roleId: t.roleID,
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
