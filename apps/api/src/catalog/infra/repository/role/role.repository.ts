import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResultAsync, okAsync } from 'neverthrow';
import { In, Repository } from 'typeorm';

import { CatalogError } from '@/catalog/domain/errors';
import { RoleCategory } from '@/catalog/domain/role-category.entity';
import { Role } from '@/catalog/domain/role.entity';
import { RoleCategoryMapper } from '@/catalog/infra/repository/role/role-category.mapper';

import { RoleWithCategory } from './role-with-category.read-model';
import { RoleMapper, RoleWithCategoryMapper } from './role.mapper';
import { RoleCategoryModel, RoleModel } from './role.model';

@Injectable()
export class RoleRepository {
  constructor(
    @InjectRepository(RoleModel)
    private readonly repository: Repository<RoleModel>,
  ) {}

  getAllCategories(): ResultAsync<RoleCategory[], CatalogError> {
    return ResultAsync.fromPromise(
      this.repository.manager.getRepository(RoleCategoryModel).find({
        order: { priority: 'DESC' },
      }),
      (error): CatalogError =>
        CatalogError.repository(
          error instanceof Error ? error.message : String(error),
        ),
    ).map((models) => models.map(RoleCategoryMapper.toDomain));
  }

  getAllByCategory(categoryId: string): ResultAsync<Role[], CatalogError> {
    // TODO: добавить проверку существования категории
    return ResultAsync.fromPromise(
      this.repository.find({
        where: { category_id: categoryId },
        order: { priority: 'DESC' },
      }),
      (error): CatalogError =>
        CatalogError.repository(
          error instanceof Error ? error.message : String(error),
        ),
    ).map((models) => models.map(RoleMapper.toDomain));
  }

  findByIdsWithCategory(
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
