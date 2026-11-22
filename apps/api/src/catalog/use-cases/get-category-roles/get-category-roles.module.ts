import { Module } from '@nestjs/common';

import { RoleRepositoryModule } from '@/catalog/infra/repository/role/role.module';

import { GetCategoryRolesHandler } from './get-category-roles.handler';

@Module({
  imports: [RoleRepositoryModule],
  providers: [GetCategoryRolesHandler],
  exports: [GetCategoryRolesHandler],
})
export class GetCategoryRolesModule {}
