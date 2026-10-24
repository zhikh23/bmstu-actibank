import { Injectable } from '@nestjs/common';
import { Result } from 'neverthrow';
import { GetRolesHandler } from '../../use-cases/get-roles/get-roles.handler';
import { RoleDto } from './role-provider.dto';

export type RoleProviderError =
  | { kind: 'NotFound'; message: string }
  | { kind: 'RepositoryError'; message: string };

@Injectable()
export class RoleProvider {
  constructor(private readonly getRolesHandler: GetRolesHandler) {}

  async getRoles(ids: string[]): Promise<Result<RoleDto[], RoleProviderError>> {
    return this.getRolesHandler.execute({ ids });
  }
}
