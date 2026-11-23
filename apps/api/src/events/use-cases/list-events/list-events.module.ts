import { Module } from '@nestjs/common';
import { EventRepositoryModule } from '@/events/infra/repository/event-repository.module';
import { ListEventsHandler } from '@/events/use-cases/list-events/list-events.handler';

@Module({
  imports: [EventRepositoryModule],
  exports: [ListEventsHandler],
  providers: [ListEventsHandler],
})
export class ListEventsModule {}
