import { Module } from '@nestjs/common';
import { OrganizationRepositoryModule } from '../../infra/repository/organization/organization.module';
import { GetOrganizationHandler } from './get-organization.handler';

@Module({
  imports: [OrganizationRepositoryModule],
  providers: [GetOrganizationHandler],
  exports: [GetOrganizationHandler],
})
export class GetOrganizationModule {}
