import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResultAsync, errAsync, okAsync } from 'neverthrow';
import { Repository } from 'typeorm';

import { CatalogError } from '@/catalog/domain/errors';
import { Format } from '@/catalog/domain/format.entity';

import { FormatMapper } from './format.mapper';
import { FormatModel } from './format.model';

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
