import { Module } from '@nestjs/common';

import { EventTypeRepositoryModule } from '@/catalog/infra/repository/event-type/event-type.module';

import { GetAllEventTypesHandler } from './get-all-event-types.handler';

@Module({
  imports: [EventTypeRepositoryModule],
  providers: [GetAllEventTypesHandler],
  exports: [GetAllEventTypesHandler],
})
export class GetAllEventTypesModule {}
