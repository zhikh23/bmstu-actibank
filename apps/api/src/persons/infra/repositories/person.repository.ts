import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PersonModel } from './person.model';
import { Repository } from 'typeorm';
import { errAsync, okAsync, ResultAsync } from 'neverthrow';
import { PersonEntity } from '../../domain/person.entity';
import { PersonsError } from '../../domain/errors';
import { PersonMapper } from './person.mapper';

@Injectable()
export class PersonRepository {
  constructor(
    @InjectRepository(PersonModel)
    private readonly repository: Repository<PersonModel>,
  ) {}

  get(id: string): ResultAsync<PersonEntity, PersonsError> {
    return ResultAsync.fromPromise(
      this.repository.findOne({
        where: { id },
      }),
      (error) =>
        PersonsError.repository(
          error instanceof Error ? error.message : String(error),
        ),
    ).andThen((model) =>
      model
        ? okAsync(PersonMapper.toDomain(model))
        : errAsync(PersonsError.notFound(`person with id "${id} not found"`)),
    );
  }

  getAll(): ResultAsync<PersonEntity[], PersonsError> {
    return ResultAsync.fromPromise(this.repository.find(), (error) =>
      PersonsError.repository(
        error instanceof Error ? error.message : String(error),
      ),
    ).map((models) => models.map(PersonMapper.toDomain));
  }
}
