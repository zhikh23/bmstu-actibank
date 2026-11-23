import { Module } from '@nestjs/common';
import { CreateEventHandler } from '@/events/use-cases/create-event/create-event.handler';
import { EventRepositoryModule } from '@/events/infra/repository/event-repository.module';
import { UuidModule } from '@/shared/infra/uuid/uuid.module';

@Module({
  imports: [EventRepositoryModule, UuidModule],
  providers: [CreateEventHandler],
  exports: [CreateEventHandler],
})
export class CreateEventModule {}
