import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Form } from '../../domain/form.entity';
import { errAsync, ResultAsync } from 'neverthrow';
import { FormsError } from '../../domain/errors';
import { FormMapper } from './form.mapper';
import { FormModel } from './form.model';

@Injectable()
export class FormRepository {
  constructor(
    @InjectRepository(FormModel)
    private readonly repository: Repository<FormModel>,
  ) {}

  save(f: Form): ResultAsync<void, FormsError> {
    return ResultAsync.fromPromise(
      this.repository.save(FormMapper.toModel(f)),
      (error): FormsError =>
        FormsError.repository(
          error instanceof Error ? error.message : String(error),
        ),
    ).map(() => undefined);
  }

  update(f: Form): ResultAsync<void, FormsError> {
    return ResultAsync.fromPromise(
      this.repository.findOneBy({ id: f.id }),
      (error): FormsError =>
        FormsError.repository(
          error instanceof Error ? error.message : String(error),
        ),
    ).andThen((model) =>
      model
        ? ResultAsync.fromPromise(
            this.repository.save(FormMapper.toModel(f)),
            (error): FormsError =>
              FormsError.repository(
                error instanceof Error ? error.message : String(error),
              ),
          ).map(() => undefined)
        : errAsync(FormsError.notFound(`form with id "${f.id}" not found`)),
    );
  }

  get(id: string): ResultAsync<Form, FormsError> {
    return ResultAsync.fromPromise(
      this.repository.findOne({
        where: { id },
        relations: {
          organizers: true,
          links: true,
          venues: true,
          themes: true,
          guests: true,
          team: true,
        },
        order: {
          organizers: {
            number: 'ASC',
          },
          links: {
            number: 'ASC',
          },
          venues: {
            number: 'ASC',
          },
          themes: {
            number: 'ASC',
          },
          guests: {
            number: 'ASC',
          },
          team: {
            number: 'ASC',
          },
        },
      }),
      (error): FormsError =>
        FormsError.repository(
          error instanceof Error ? error.message : String(error),
        ),
    ).andThen((model) =>
      model
        ? FormMapper.toDomain(model)
        : errAsync(FormsError.notFound(`form with id "${id} not found"`)),
    );
  }
}
