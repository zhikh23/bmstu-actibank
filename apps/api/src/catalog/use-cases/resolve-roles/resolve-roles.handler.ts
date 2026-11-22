import { Injectable } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';

import { CatalogError } from '@/catalog/domain/errors';
import { RoleRepository } from '@/catalog/infra/repository/role/role.repository';

import { RoleWithCategoryType } from './resolve-roles.data';

export type ResolveRolesQuery = {
  ids: string[];
};

@Injectable()
export class ResolveRolesHandler {
  constructor(private readonly repository: RoleRepository) {}

  execute(
    q: ResolveRolesQuery,
  ): ResultAsync<RoleWithCategoryType[], CatalogError> {
    return this.repository.findByIdsWithCategory(q.ids);
  }
}
