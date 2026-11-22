import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResultAsync, errAsync, okAsync } from 'neverthrow';
import { Repository } from 'typeorm';

import { CatalogError } from '@/catalog/domain/errors';
import { Level } from '@/catalog/domain/level.entity';

import { LevelMapper } from './level.mapper';
import { LevelModel } from './level.model';

@Injectable()
export class LevelRepository {
  constructor(
    @InjectRepository(LevelModel)
    private readonly repository: Repository<LevelModel>,
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
        ? okAsync(LevelMapper.toDomain(model))
        : errAsync(CatalogError.notFound(`level with "${id}" not found`));
    });
  }

  getAll(): ResultAsync<Level[], CatalogError> {
    return ResultAsync.fromPromise(
      this.repository.find(),
      (error): CatalogError =>
        CatalogError.repository(
          error instanceof Error ? error.message : String(error),
        ),
    ).map((models) => models.map(LevelMapper.toDomain));
  }
}
