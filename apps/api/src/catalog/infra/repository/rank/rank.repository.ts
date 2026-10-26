import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { okAsync, ResultAsync } from 'neverthrow';
import { RankModel } from './rank.model';
import { Rank } from '../../../domain/rank.entity';
import { CatalogError } from '../../../domain/errors';
import { RankMapper } from './rank.mapper';

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
          return model ? RankMapper.toDomain(model) : { id, title: '' };
        }),
      );
    });
  }
}
