import { Module } from '@nestjs/common';
import { OrganizationProvider } from './organization-provider.service';
import { GetOrganizationModule } from '../../use-cases/get-organization/get-organization.module';

@Module({
  imports: [GetOrganizationModule],
  providers: [OrganizationProvider],
  exports: [OrganizationProvider],
})
export class OrganizationProviderModule {}
