import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoleCategoryModel, RoleModel } from './role.model';
import { RoleRepository } from './role.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RoleModel, RoleCategoryModel])],
  providers: [RoleRepository],
  exports: [RoleRepository],
})
export class RoleRepositoryModule {}
