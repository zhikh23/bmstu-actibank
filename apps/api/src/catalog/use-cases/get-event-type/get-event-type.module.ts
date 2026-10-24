import { Module } from '@nestjs/common';
import { GetEventTypeHandler } from './get-event-type.handler';
import { EventTypeRepositoryModule } from '../../infra/repository/event-type/event-type.module';

@Module({
  imports: [EventTypeRepositoryModule],
  providers: [GetEventTypeHandler],
  exports: [GetEventTypeHandler],
})
export class GetEventTypeModule {}
