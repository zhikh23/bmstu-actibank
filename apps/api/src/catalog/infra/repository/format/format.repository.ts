import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FormatModel } from './format.model';
import { Repository } from 'typeorm';
import { errAsync, okAsync, ResultAsync } from 'neverthrow';
import { Level } from '../../../domain/level.entity';
import { CatalogError } from '../../../domain/errors';
import { FormatMapper } from './format.mapper';

@Injectable()
export class FormatRepository {
  constructor(
    @InjectRepository(FormatModel)
    private readonly repository: Repository<FormatModel>,
  ) {}

  get(id: string): ResultAsync<Level, CatalogError> {
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
}
