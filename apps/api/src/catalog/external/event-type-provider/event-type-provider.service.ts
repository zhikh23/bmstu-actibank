import { Injectable } from '@nestjs/common';
import { Result, err, ok } from 'neverthrow';
import { EventTypeDto } from './event-type-provider.dto';
import { GetEventTypeHandler } from '../../use-cases/get-event-type/get-event-type.handler';

export type EventTypeProviderError =
  | { kind: 'NotFound'; message: string }
  | { kind: 'RepositoryError'; message: string };

@Injectable()
export class EventTypeProvider {
  constructor(private readonly getEventTypeHandler: GetEventTypeHandler) {}

  async getEventType(
    id: string,
  ): Promise<Result<EventTypeDto, EventTypeProviderError>> {
    return this.getEventTypeHandler.execute({ id });
  }
}
