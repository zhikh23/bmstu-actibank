import { Module } from '@nestjs/common';

import { RoleRepositoryModule } from '@/catalog/infra/repository/role/role.module';

import { GetAllRoleCategoriesHandler } from './get-all-role-categories.handler';

@Module({
  imports: [RoleRepositoryModule],
  providers: [GetAllRoleCategoriesHandler],
  exports: [GetAllRoleCategoriesHandler],
})
export class GetAllRoleCategoriesModule {}
