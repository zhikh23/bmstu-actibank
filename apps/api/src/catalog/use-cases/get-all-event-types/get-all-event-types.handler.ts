import { Injectable } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';

import { CatalogError } from '@/catalog/domain/errors';
import { EventTypeRepository } from '@/catalog/infra/repository/event-type/event-type.repository';

import { EventType } from './get-all-event-types.data';

@Injectable()
export class GetAllEventTypesHandler {
  constructor(private readonly repository: EventTypeRepository) {}

  execute(): ResultAsync<EventType[], CatalogError> {
    return this.repository.getAll();
  }
}
