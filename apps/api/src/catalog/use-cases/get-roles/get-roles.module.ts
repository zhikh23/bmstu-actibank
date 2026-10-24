import { Module } from '@nestjs/common';
import { RoleRepositoryModule } from '../../infra/repository/role/role.module';
import { GetRolesHandler } from './get-roles.handler';

@Module({
  imports: [RoleRepositoryModule],
  providers: [GetRolesHandler],
  exports: [GetRolesHandler],
})
export class GetRolesModule {}
