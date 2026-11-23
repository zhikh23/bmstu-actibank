import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { EventsError } from '@/events/domain/events.error';
import { ResultAsync } from 'neverthrow';
import { AuthenticatedUser } from '@/shared/domain/authenticated-user.entity';
import { ListEventsRequest } from './dto/list-events.request';
import {
  ListEventsItem,
  ListEventsResponse,
} from '@/events/presentation/dto/list-events.response';
import { ListEventsHandler } from '@/events/use-cases/list-events/list-events.handler';
import { ListEventsItemType } from '@/events/use-cases/list-events/list-events.data';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(private readonly listEvents: ListEventsHandler) {}

  list(
    actor: AuthenticatedUser,
    req: ListEventsRequest,
  ): Promise<ListEventsResponse> {
    return this.resolve(
      this.listEvents
        .execute({
          actor,
          timeRange:
            req.start && req.end
              ? {
                  start: req.start,
                  end: req.end,
                }
              : undefined,
          search: req.search,
          organizerIds: req.organizerIds,
          page: {
            offset: req.offset,
            limit: req.limit,
          },
          sort: {
            by: req.sortBy,
            order: req.sortOrder,
          },
        })
        .map((paged) => paged.items.map(this.mapEventToEventListItem)),
    );
  }

  private mapEventToEventListItem(e: ListEventsItemType): ListEventsItem {
    return {
      ...e,
      start: e.start.toISOString(),
      end: e.end.toISOString(),
      createdAt: e.createdAt.toISOString(),
    };
  }

  private resolve<T>(result: ResultAsync<T, EventsError>): Promise<T> {
    return result.match(
      (value) => value,
      (error) => {
        switch (error.kind) {
          case 'Forbidden':
            throw new ForbiddenException(error.reason);
          case 'NotFound':
            throw new NotFoundException(error.message);
          case 'InvariantViolation':
            throw new UnprocessableEntityException(error.message);
          default:
            this.logger.error(error);
            throw new InternalServerErrorException();
        }
      },
    );
  }
}
