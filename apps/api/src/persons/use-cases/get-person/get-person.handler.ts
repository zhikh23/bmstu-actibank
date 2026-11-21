import { Injectable } from '@nestjs/common';
import { PersonRepository } from '../../infra/repositories/person.repository';
import { ResultAsync } from 'neverthrow';
import { PersonType } from './get-person.data';
import { PersonsError } from '../../domain/errors';

export type GetPersonQuery = {
  personId: string;
};

@Injectable()
export class GetPersonHandler {
  constructor(private readonly repository: PersonRepository) {}

  execute(q: GetPersonQuery): ResultAsync<PersonType, PersonsError> {
    return this.repository.get(q.personId);
  }
}
