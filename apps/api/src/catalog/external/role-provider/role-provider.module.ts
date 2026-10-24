import { Module } from '@nestjs/common';
import { GetRolesModule } from '../../use-cases/get-roles/get-roles.module';
import { RoleProvider } from './role-provider.service';

@Module({
  imports: [GetRolesModule],
  providers: [RoleProvider],
  exports: [RoleProvider],
})
export class RoleProviderModule {}
