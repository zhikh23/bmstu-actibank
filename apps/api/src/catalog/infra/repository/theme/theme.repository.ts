import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ThemeModel } from './theme.model';
import { In, Repository } from 'typeorm';
import { okAsync, ResultAsync } from 'neverthrow';
import { Theme } from '../../../domain/theme.entity';
import { CatalogError } from '../../../domain/errors';
import { ThemeMapper } from './theme.mapper';

@Injectable()
export class ThemeRepository {
  constructor(
    @InjectRepository(ThemeModel)
    private readonly repository: Repository<ThemeModel>,
  ) {}

  getAll(ids: string[]): ResultAsync<Theme[], CatalogError> {
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
}
