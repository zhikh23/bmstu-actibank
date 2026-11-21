import { Injectable } from '@nestjs/common';
import { PersonRepository } from '../../infra/repositories/person.repository';
import { ResultAsync } from 'neverthrow';
import { PersonsError } from '../../domain/errors';
import { PersonsListItem } from './list-persons.data';

@Injectable()
export class ListPersonsHandler {
  constructor(private readonly repository: PersonRepository) {}

  execute(): ResultAsync<PersonsListItem[], PersonsError> {
    return this.repository.getAll();
  }
}
