import { Injectable } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';

import { CatalogError } from '@/catalog/domain/errors';
import { RoleRepository } from '@/catalog/infra/repository/role/role.repository';

import { RoleType } from './get-roles.data';

export type GetRolesQuery = {
  ids: string[];
};

@Injectable()
export class GetRolesHandler {
  constructor(private readonly repository: RoleRepository) {}

  execute(q: GetRolesQuery): ResultAsync<RoleType[], CatalogError> {
    return this.repository.getAllWithCategory(q.ids);
  }
}
