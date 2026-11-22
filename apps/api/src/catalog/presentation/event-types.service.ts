import { Injectable } from '@nestjs/common';

import { GetAllEventTypesHandler } from '@/catalog/use-cases/get-all-event-types/get-all-event-types.handler';
import { EventTypeDto } from '@/shared/presentation/dto/event-type.dto';

import { CatalogService } from './catalog.service';

@Injectable()
export class EventTypesService extends CatalogService {
  constructor(private readonly allEventTypes: GetAllEventTypesHandler) {
    super();
  }

  getAllEventTypes(): Promise<EventTypeDto[]> {
    return this.resolve(this.allEventTypes.execute());
  }
}
