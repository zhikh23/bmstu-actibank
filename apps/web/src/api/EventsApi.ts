import { httpClient } from './http';
import { EventsListItemContract } from '@/adapters/events.adapter';

export interface ListEventsQuery {
  sortBy?: 'name' | 'start' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  search?: string;
  start?: Date;
  end?: Date;
  organizerIds?: string[];
}

export class EventsApi {
  constructor(private http = httpClient) {}

  async listEvents({
    sortBy,
    sortOrder,
    search,
    start,
    end,
    organizerIds,
  }: ListEventsQuery): Promise<EventsListItemContract[]> {
    const response = await this.http.get<EventsListItemContract[]>(
      '/api/v1/events',
      {
        params: {
          sortBy,
          sortOrder,
          search,
          start: start?.toISOString(),
          end: end?.toISOString(),
          organizerIds: organizerIds?.join(','),
        },
      },
    );
    return response.data;
  }
}
