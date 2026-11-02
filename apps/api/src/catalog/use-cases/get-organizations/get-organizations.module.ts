import { Module } from '@nestjs/common';
import { OrganizationRepositoryModule } from '../../infra/repository/organization/organization.module';
import { GetOrganizationsHandler } from './get-organizations.handler';

@Module({
  imports: [OrganizationRepositoryModule],
  providers: [GetOrganizationsHandler],
  exports: [GetOrganizationsHandler],
})
export class GetOrganizationsModule {}
