import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { okAsync, ResultAsync } from 'neverthrow';
import { In, Repository } from 'typeorm';

import { CatalogError } from '@/catalog/domain/errors';
import { Rank } from '@/catalog/domain/rank.entity';

import { RankMapper } from './rank.mapper';
import { RankModel } from './rank.model';

@Injectable()
export class RankRepository {
  constructor(
    @InjectRepository(RankModel)
    private readonly repository: Repository<RankModel>,
  ) {}

  getAll(ids: string[]): ResultAsync<Rank[], CatalogError> {
    return ResultAsync.fromPromise(
      this.repository.find({
        where: { id: In(ids) },
      }),
      (error): CatalogError =>
        CatalogError.repository(
          error instanceof Error ? error.message : String(error),
        ),
    ).andThen((models) => {
      const byId = new Map(models.map((m) => [m.id, m]));
      return okAsync(
        ids.map((id) => {
          const model = byId.get(id);
          return model ? RankMapper.toDomain(model) : { id, name: '' };
        }),
      );
    });
  }

  getAllRanks(): ResultAsync<Rank[], CatalogError> {
    return ResultAsync.fromPromise(
      this.repository.find(),
      (error): CatalogError =>
        CatalogError.repository(
          error instanceof Error ? error.message : String(error),
        ),
    ).map((models) => models.map(RankMapper.toDomain));
  }
}
