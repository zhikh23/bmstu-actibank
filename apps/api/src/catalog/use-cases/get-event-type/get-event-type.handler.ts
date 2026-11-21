import { Injectable } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';

import { CatalogError } from '@/catalog/domain/errors';
import { EventTypeRepository } from '@/catalog/infra/repository/event-type/event-type.repository';

import { EventType } from './get-event-type.data';

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
