import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResultAsync, okAsync } from 'neverthrow';
import { In, Repository } from 'typeorm';

import { CatalogError } from '@/catalog/domain/errors';
import { Theme } from '@/catalog/domain/theme.entity';

import { ThemeMapper } from './theme.mapper';
import { ThemeModel } from './theme.model';

@Injectable()
export class ThemeRepository {
  constructor(
    @InjectRepository(ThemeModel)
    private readonly repository: Repository<ThemeModel>,
  ) {}

  findByIds(ids: string[]): ResultAsync<Theme[], CatalogError> {
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
          return model ? ThemeMapper.toDomain(model) : { id, name: '' };
        }),
      );
    });
  }

  getAll(): ResultAsync<Theme[], CatalogError> {
    return ResultAsync.fromPromise(
      this.repository.find(),
      (error): CatalogError =>
        CatalogError.repository(
          error instanceof Error ? error.message : String(error),
        ),
    ).map((models) => models.map(ThemeMapper.toDomain));
  }
}
