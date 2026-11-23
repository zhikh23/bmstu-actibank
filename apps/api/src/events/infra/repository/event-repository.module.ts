import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  EventGuestModel,
  EventLinkModel,
  EventMemberModel,
  EventModel,
  EventOrganizerModel,
  EventThemeModel,
  EventVenueModel,
} from './event.model';
import { EventRepository } from '@/events/infra/repository/event.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EventOrganizerModel,
      EventLinkModel,
      EventVenueModel,
      EventThemeModel,
      EventGuestModel,
      EventMemberModel,
      EventModel,
    ]),
  ],
  exports: [EventRepository],
  providers: [EventRepository],
})
export class EventRepositoryModule {}
