import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Form } from '../../domain/form.entity';
import { ResultAsync } from 'neverthrow';
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
}
