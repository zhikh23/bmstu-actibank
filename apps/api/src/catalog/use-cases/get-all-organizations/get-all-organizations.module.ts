import { Module } from '@nestjs/common';

import { OrganizationRepositoryModule } from '@/catalog/infra/repository/organization/organization.module';

import { GetAllOrganizationsHandler } from './get-all-organizations.handler';

@Module({
  imports: [OrganizationRepositoryModule],
  providers: [GetAllOrganizationsHandler],
  exports: [GetAllOrganizationsHandler],
})
export class GetAllOrganizationsModule {}
