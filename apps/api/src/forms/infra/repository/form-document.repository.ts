import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FormDocumentModel } from './form.model';
import { FormDocument } from '../../domain/form-document.entity';
import { errAsync, okAsync, ResultAsync } from 'neverthrow';
import { FormsError } from '../../domain/errors';
import { Repository } from 'typeorm';
import { FormDocumentMapper } from './form-document.mapper';

@Injectable()
export class FormDocumentRepository {
  constructor(
    @InjectRepository(FormDocumentModel)
    private readonly repository: Repository<FormDocumentModel>,
  ) {}

  save(d: FormDocument): ResultAsync<void, FormsError> {
    return ResultAsync.fromPromise(
      this.repository.save(FormDocumentMapper.toModel(d)),
      (error): FormsError =>
        FormsError.repository(
          error instanceof Error ? error.message : String(error),
        ),
    ).map(() => undefined);
  }

  get(id: string): ResultAsync<FormDocument, FormsError> {
    return ResultAsync.fromPromise(
      this.repository.findOneBy({ id }),
      (error): FormsError =>
        FormsError.repository(
          error instanceof Error ? error.message : String(error),
        ),
    ).andThen((model) =>
      model
        ? okAsync(FormDocumentMapper.toDomain(model))
        : errAsync(
            FormsError.notFound(`form document with id "${id}" not found`),
          ),
    );
  }
}
