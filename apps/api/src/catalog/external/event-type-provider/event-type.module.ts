import { Module } from '@nestjs/common';
import { EventTypeProvider } from './event-type-provider.service';
import { GetEventTypeModule } from '../../use-cases/get-event-type/get-event-type.module';

@Module({
  imports: [GetEventTypeModule],
  providers: [EventTypeProvider],
  exports: [EventTypeProvider],
})
export class EventTypeProviderModule {}
