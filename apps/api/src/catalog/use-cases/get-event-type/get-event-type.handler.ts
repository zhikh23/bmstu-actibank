import { Injectable } from '@nestjs/common';
import { EventTypeRepository } from '../../infra/repository/event-type/event-type.repository';
import { ResultAsync } from 'neverthrow';
import { EventType } from './get-event-type.data';
import { CatalogError } from '../../domain/errors';

export type GetEventTypeQuery = {
  id: string;
};

@Injectable()
export class GetEventTypeHandler {
  constructor(private readonly repository: EventTypeRepository) {}

  execute(q: GetEventTypeQuery): ResultAsync<EventType, CatalogError> {
    return this.repository.get(q.id);
  }
}
