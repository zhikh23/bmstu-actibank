import { Module } from '@nestjs/common';
import { ListPersonsHandler } from './list-persons.handler';
import { PersonRepositoryModule } from '../../infra/repositories/person.module';

@Module({
  imports: [PersonRepositoryModule],
  providers: [ListPersonsHandler],
  exports: [ListPersonsHandler],
})
export class ListPersonsModule {}
