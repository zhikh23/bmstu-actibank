import { Module } from '@nestjs/common';
import { FormRepositoryModule } from '../../infra/repository/repository.module';
import { GetFormHandler } from './get-form.handler';
import { VenueProviderModule } from '../../../catalog/external/venue-provider/venue-provider.module';
import { ThemeProviderModule } from '../../../catalog/external/theme-provider/theme-provider.module';
import { EventTypeProviderModule } from '../../../catalog/external/event-type-provider/event-type.module';
import { FormatProviderModule } from '../../../catalog/external/format-provider/format-provider.module';
import { LevelProviderModule } from '../../../catalog/external/level-provider/level-provider.module';
import { RoleProviderModule } from '../../../catalog/external/role-provider/role-provider.module';
import { OrganizationProviderModule } from '../../../catalog/external/organization-provider/organization-provider.module';
import { RankProviderModule } from '../../../catalog/external/rank-provider/rank-provider.module';

@Module({
  imports: [
    FormRepositoryModule,
    EventTypeProviderModule,
    FormatProviderModule,
    LevelProviderModule,
    VenueProviderModule,
    ThemeProviderModule,
    RoleProviderModule,
    OrganizationProviderModule,
    RankProviderModule,
  ],
  providers: [GetFormHandler],
  exports: [GetFormHandler],
})
export class GetFormModule {}
