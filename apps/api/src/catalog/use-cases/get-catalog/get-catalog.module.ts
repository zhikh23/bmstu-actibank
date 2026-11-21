import { Module } from '@nestjs/common';

import { EventTypeRepositoryModule } from '@/catalog/infra/repository/event-type/event-type.module';
import { FormatRepositoryModule } from '@/catalog/infra/repository/format/format.module';
import { LevelRepositoryModule } from '@/catalog/infra/repository/level/level.module';
import { OrganizationRepositoryModule } from '@/catalog/infra/repository/organization/organization.module';
import { RankRepositoryModule } from '@/catalog/infra/repository/rank/rank.module';
import { RoleRepositoryModule } from '@/catalog/infra/repository/role/role.module';
import { ThemeRepositoryModule } from '@/catalog/infra/repository/theme/theme.module';
import { VenueRepositoryModule } from '@/catalog/infra/repository/venue/venue.module';

import { GetCatalogHandler } from './get-catalog.handler';

@Module({
  imports: [
    EventTypeRepositoryModule,
    FormatRepositoryModule,
    LevelRepositoryModule,
    RankRepositoryModule,
    ThemeRepositoryModule,
    VenueRepositoryModule,
    OrganizationRepositoryModule,
    RoleRepositoryModule,
  ],
  providers: [GetCatalogHandler],
  exports: [GetCatalogHandler],
})
export class GetCatalogModule {}
