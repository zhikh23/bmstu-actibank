import { Injectable } from '@nestjs/common';
import { RoleRepository } from '../../infra/repository/role/role.repository';
import { Result } from 'neverthrow';
import { RoleType } from './get-roles.data';
import { CatalogError } from '../../domain/errors';

export type GetRolesQuery = {
  ids: string[];
};

@Injectable()
export class GetRolesHandler {
  constructor(private readonly repository: RoleRepository) {}

  async execute(q: GetRolesQuery): Promise<Result<RoleType[], CatalogError>> {
    return this.repository.getAllWithCategory(q.ids);
  }
}
