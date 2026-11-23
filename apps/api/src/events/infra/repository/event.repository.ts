import { InjectRepository } from '@nestjs/typeorm';
import { EventModel } from '@/events/infra/repository/event.model';
import { Repository } from 'typeorm';
import { errAsync, okAsync, Result, ResultAsync } from 'neverthrow';
import { EventEntity } from '@/events/domain/event.entity';
import { EventsError } from '@/events/domain/events.error';
import { Paged } from '@/shared/domain/paged';
import { EventMapper } from '@/events/infra/repository/event.mapper';

export type SortBy = 'name' | 'start' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export interface EventsListQuery {
  actorId: string;
  isModerator: boolean;
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
    by?: SortBy | undefined;
    order?: SortOrder | undefined;
  };
}

export class EventRepository {
  constructor(
    @InjectRepository(EventModel)
    private readonly events: Repository<EventModel>,
  ) {}

  save(e: EventEntity): ResultAsync<EventEntity, EventsError> {
    return ResultAsync.fromPromise(
      this.events.save(EventMapper.toModel(e)),
      (error): EventsError =>
        EventsError.repository(
          error instanceof Error ? error.message : String(error),
        ),
    ).map(() => e);
  }

  list(q: EventsListQuery): ResultAsync<Paged<EventEntity>, EventsError> {
    const qb = this.events
      .createQueryBuilder('e')
      .leftJoinAndSelect('e.organizers', 'eo')
      .leftJoinAndSelect('e.links', 'el')
      .leftJoinAndSelect('e.venues', 'evs')
      .leftJoinAndSelect('e.themes', 'eth')
      .leftJoinAndSelect('e.guests', 'eg')
      .where('e.deleted_at IS NULL');

    if (!q.isModerator) {
      qb.leftJoinAndSelect('e.team', 'et', 'et.user_id = :actorId', {
        actorId: q.actorId,
      }).andWhere('(e.submitter_id = :actorId OR et.user_id IS NOT NULL)', {
        actorId: q.actorId,
      });
    } else {
      qb.leftJoinAndSelect('e.team', 'et', 'et.event_id = e.id');
    }

    if (q.timeRange) {
      qb.andWhere('e.start >= :start AND e.start <= :end', {
        start: q.timeRange.start,
        end: q.timeRange.end,
      });
    }

    if (q.organizerIds?.length) {
      qb.andWhere(
        `EXISTS (
          SELECT 1 FROM events_organizers eo2
           WHERE eo2.event_id = e.id
             AND eo2.organizer_id IN (:...organizerIds)
        )`,
        { organizerIds: Array.from(q.organizerIds) },
      );
    }

    if (q.search) {
      qb.andWhere('e.name ILIKE :search', { search: `%${q.search}%` });
    }

    const sortColumn: Record<SortBy, string> = {
      name: 'e.name',
      createdAt: 'e.created_at',
      start: 'e.start',
    };
    const sortOrder: Record<SortOrder, 'ASC' | 'DESC'> = {
      asc: 'ASC',
      desc: 'DESC',
    };

    qb.orderBy(
      sortColumn[q.sort?.by ?? 'createdAt'],
      sortOrder[q.sort?.order ?? 'desc'],
    ).addOrderBy('e.id', 'ASC');

    // limit плохо работает с join, поэтому пока что не используем
    //qb.limit(q.page?.limit ?? DEFAULT_PAGE_SIZE).offset(q.page?.offset);

    return ResultAsync.fromPromise(qb.getManyAndCount(), (e): EventsError =>
      EventsError.repository(e instanceof Error ? e.message : String(e)),
    ).andThen(([models, total]) => {
      const mapped = Result.combine(models.map(EventMapper.toDomain));
      return mapped.isOk()
        ? okAsync({ items: mapped.value, total })
        : errAsync(mapped.error);
    });
  }
}
