import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FormatModel } from './format.model';
import { Repository } from 'typeorm';
import { errAsync, okAsync, ResultAsync } from 'neverthrow';
import { Format } from '../../../domain/format.entity';
import { CatalogError } from '../../../domain/errors';
import { FormatMapper } from './format.mapper';

@Injectable()
export class FormatRepository {
  constructor(
    @InjectRepository(FormatModel)
    private readonly repository: Repository<FormatModel>,
  ) {}

  get(id: string): ResultAsync<Format, CatalogError> {
    return ResultAsync.fromPromise(
      this.repository.findOne({
        where: { id },
      }),
      (error): CatalogError =>
        CatalogError.repository(
          error instanceof Error ? error.message : String(error),
        ),
    ).andThen((model) => {
      return model
        ? okAsync(FormatMapper.toDomain(model))
        : errAsync(CatalogError.notFound(`format with "${id}" not found`));
    });
  }

  getAll(): ResultAsync<Format[], CatalogError> {
    return ResultAsync.fromPromise(
      this.repository.find(),
      (error): CatalogError =>
        CatalogError.repository(
          error instanceof Error ? error.message : String(error),
        ),
    ).map((models) => models.map(FormatMapper.toDomain));
  }
}
