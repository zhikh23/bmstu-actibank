import { ResultAsync } from 'neverthrow';
import { Injectable } from '@nestjs/common';

import { CreateEventHandler } from '@/events/use-cases/create-event/create-event.handler';

import { CreateEventInput } from './dto/create-event.input';

export type EventsServiceError =
  | { kind: 'InvariantViolation'; message: string }
  | { kind: 'RepositoryError'; message: string }
  | { kind: 'NotFound'; message: string }
  | { kind: 'Forbidden'; reason: string };

@Injectable()
export class EventsService {
  constructor(private readonly createEvent: CreateEventHandler) {}

  create(input: CreateEventInput): ResultAsync<string, EventsServiceError> {
    return this.createEvent
      .execute(input)
      .mapErr((error) => error as EventsServiceError);
  }
}
