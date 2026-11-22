import { Injectable } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';

import { CatalogError } from '@/catalog/domain/errors';
import { RoleRepository } from '@/catalog/infra/repository/role/role.repository';

import { RoleCategoryType } from './get-all-role-categories.data';

@Injectable()
export class GetAllRoleCategoriesHandler {
  constructor(private readonly repository: RoleRepository) {}

  execute(): ResultAsync<RoleCategoryType[], CatalogError> {
    return this.repository.getAllCategories();
  }
}
