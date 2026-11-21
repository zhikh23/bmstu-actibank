import { Module } from '@nestjs/common';
import { GetPersonHandler } from './get-person.handler';
import { PersonRepositoryModule } from '../../infra/repositories/person.module';

@Module({
  imports: [PersonRepositoryModule],
  providers: [GetPersonHandler],
  exports: [GetPersonHandler],
})
export class GetPersonModule {}
