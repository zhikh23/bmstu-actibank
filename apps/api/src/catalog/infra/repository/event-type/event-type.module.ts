import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventTypeModel } from './event-type.model';
import { EventTypeRepository } from './event-type.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EventTypeModel])],
  providers: [EventTypeRepository],
  exports: [EventTypeRepository],
})
export class EventTypeRepositoryModule {}
