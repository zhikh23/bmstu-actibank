import { Module } from '@nestjs/common';

import { EventTypeRepositoryModule } from '@/catalog/infra/repository/event-type/event-type.module';

import { GetEventTypeHandler } from './get-event-type.handler';

@Module({
  imports: [EventTypeRepositoryModule],
  providers: [GetEventTypeHandler],
  exports: [GetEventTypeHandler],
})
export class GetEventTypeModule {}
