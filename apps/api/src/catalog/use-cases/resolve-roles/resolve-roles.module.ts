import { Module } from '@nestjs/common';

import { RoleRepositoryModule } from '@/catalog/infra/repository/role/role.module';

import { ResolveRolesHandler } from './resolve-roles.handler';

@Module({
  imports: [RoleRepositoryModule],
  providers: [ResolveRolesHandler],
  exports: [ResolveRolesHandler],
})
export class ResolveRolesModule {}
