import { Module } from '@nestjs/common';

import { OrganizationRepositoryModule } from '@/catalog/infra/repository/organization/organization.module';

import { ResolveOrganizationsHandler } from './resolve-organizations.handler';

@Module({
  imports: [OrganizationRepositoryModule],
  providers: [ResolveOrganizationsHandler],
  exports: [ResolveOrganizationsHandler],
})
export class ResolveOrganizationsModule {}
