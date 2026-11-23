import { Module } from '@nestjs/common';
import { ListEventsModule } from '@/events/use-cases/list-events/list-events.module';
import { EventsController } from '@/events/presentation/events.controller';
import { EventsService } from '@/events/presentation/events.service';
import { CreateEventModule } from '@/events/use-cases/create-event/create-event.module';

@Module({
  imports: [CreateEventModule, ListEventsModule],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
