import { Module } from '@nestjs/common';
import { GetPersonModule } from './use-cases/get-person/get-person.module.ts';
import { PersonsController } from './presentation/persons.controller';
import { PersonsService } from './presentation/persons.service';
import { ListPersonsModule } from './use-cases/list-persons/list-persons.module';

@Module({
  imports: [GetPersonModule, ListPersonsModule],
  controllers: [PersonsController],
  providers: [PersonsService],
})
export class PersonsModule {}
