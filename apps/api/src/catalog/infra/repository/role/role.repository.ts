import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { errAsync, okAsync, ResultAsync } from 'neverthrow';
import { In, Repository } from 'typeorm';

import { CatalogError } from '@/catalog/domain/errors';

import { RoleWithCategory } from './role-with-category.read-model';
import { RoleWithCategoryMapper } from './role.mapper';
import { RoleCategoryModel, RoleModel } from './role.model';

@Injectable()
export class RoleRepository {
  constructor(
    @InjectRepository(RoleModel)
    private readonly repository: Repository<RoleModel>,
  ) {}

  getCategories(): ResultAsync<{ id: string; name: string }[], CatalogError> {
    return ResultAsync.fromPromise(
      this.repository.manager.getRepository(RoleCategoryModel).find(),
      (error): CatalogError =>
        CatalogError.repository(
          error instanceof Error ? error.message : String(error),
        ),
    ).map((models) => models.map(({ id, name }) => ({ id, name })));
  }

  getAllWithCategoryByCategory(
    categoryId: string,
  ): ResultAsync<RoleWithCategory[], CatalogError> {
    return ResultAsync.fromPromise(
      this.repository.find({
        where: { category_id: categoryId },
        relations: { category: true },
      }),
      (error): CatalogError =>
        CatalogError.repository(
          error instanceof Error ? error.message : String(error),
        ),
    ).map((models) => models.map(RoleWithCategoryMapper.toReadModel));
  }

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
