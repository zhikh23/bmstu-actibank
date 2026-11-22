import { Injectable } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';

import { CatalogError } from '@/catalog/domain/errors';
import { RoleRepository } from '@/catalog/infra/repository/role/role.repository';

import { RoleType } from './get-category-roles.data';

export type GetBuildingVenuesQuery = {
  categoryId: string;
};

@Injectable()
export class GetCategoryRolesHandler {
  constructor(private readonly repository: RoleRepository) {}

  execute(q: GetBuildingVenuesQuery): ResultAsync<RoleType[], CatalogError> {
    return this.repository.getAllByCategory(q.categoryId);
  }
}
