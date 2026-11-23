import { Module } from '@nestjs/common';
import { CreateEventModule } from '@/events/use-cases/create-event/create-event.module';
import { EventsService } from './events.service';

@Module({
  imports: [CreateEventModule],
  exports: [EventsService],
  providers: [EventsService],
})
export class EventsServiceModule {}
