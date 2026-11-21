import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonModel } from './person.model';
import { PersonRepository } from './person.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PersonModel])],
  providers: [PersonRepository],
  exports: [PersonRepository],
})
export class PersonRepositoryModule {}
