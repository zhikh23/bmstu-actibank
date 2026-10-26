import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleModel } from './role.model';
import { In, Repository } from 'typeorm';
import { errAsync, okAsync, ResultAsync } from 'neverthrow';
import { RoleWithCategory } from './role-with-category.read-model';
import { CatalogError } from '../../../domain/errors';
import { RoleWithCategoryMapper } from './role.mapper';

@Injectable()
export class RoleRepository {
  constructor(
    @InjectRepository(RoleModel)
    private readonly repository: Repository<RoleModel>,
  ) {}

  getWithCategory(id: string): ResultAsync<RoleWithCategory, CatalogError> {
    return ResultAsync.fromPromise(
      this.repository.findOne({
        where: { id },
        relations: {
          category: true,
        },
      }),
      (error): CatalogError =>
        CatalogError.repository(
          error instanceof Error ? error.message : String(error),
        ),
    ).andThen((model) =>
      model
        ? okAsync(RoleWithCategoryMapper.toReadModel(model))
        : errAsync(CatalogError.notFound(`role with id "${id}" not found`)),
    );
  }

  getAllWithCategory(
    ids: string[],
  ): ResultAsync<RoleWithCategory[], CatalogError> {
    return ResultAsync.fromPromise(
      this.repository.find({
        where: { id: In(ids) },
        relations: {
          category: true,
        },
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
          return model
            ? RoleWithCategoryMapper.toReadModel(model)
            : { id, name: '', category: { id: '', name: '' } };
        }),
      );
    });
  }
}
