import { Injectable } from '@nestjs/common';
import { RoleRepository } from '../../infra/repository/role/role.repository';
import { ResultAsync } from 'neverthrow';
import { RoleType } from './get-roles.data';
import { CatalogError } from '../../domain/errors';

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
