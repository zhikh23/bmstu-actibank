import { Injectable } from '@nestjs/common';
import { EventRepository } from '@/events/infra/repository/event.repository';
import {
  AuthenticatedUser,
  UserRole,
} from '@/shared/domain/authenticated-user.entity';
import { Paged } from '@/shared/domain/paged';
import { ListEventsItemType } from '@/events/use-cases/list-events/list-events.data';
import { instantToDate, plainDateTimeToDate } from '@/shared/utils/dates';
import { ResultAsync } from 'neverthrow';
import { EventsError } from '@/events/domain/events.error';

export type ListEventsSortBy = 'name' | 'start' | 'createdAt';
export type ListEventsSortOrder = 'asc' | 'desc';

export interface ListEventsQuery {
  actor: AuthenticatedUser;
  timeRange?:
    | {
        start: Date;
        end: Date;
      }
    | undefined;
  search?: string | undefined;
  organizerIds?: string[] | undefined;
  page: {
    offset?: number | undefined;
    limit?: number | undefined;
  };
  sort: {
    by?: ListEventsSortBy | undefined;
    order?: ListEventsSortOrder | undefined;
  };
}

@Injectable()
export class ListEventsHandler {
  constructor(private readonly repository: EventRepository) {}

  execute(
    q: ListEventsQuery,
  ): ResultAsync<Paged<ListEventsItemType>, EventsError> {
    const query = {
      ...q,
      actorId: q.actor.id,
      isModerator: q.actor.roles.includes(UserRole.Moderator),
    };
    return this.repository.list(query).map((paged) => ({
      total: paged.total,
      items: paged.items.map((event) => ({
        id: event.id,
        slug: event.slug,
        name: event.name,
        description: event.description,
        organizers: event.organizers,
        start: plainDateTimeToDate(event.start),
        end: plainDateTimeToDate(event.end),
        createdAt: instantToDate(event.createdAt),
      })),
    }));
  }
}
