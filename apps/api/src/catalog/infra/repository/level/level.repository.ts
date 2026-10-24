import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LevelModel } from './level.model';
import { Repository } from 'typeorm';
import { errAsync, okAsync, ResultAsync } from 'neverthrow';
import { Level } from '../../../domain/level.entity';
import { CatalogError } from '../../../domain/errors';
import { LevelMapper } from './level.mapper';

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
}
