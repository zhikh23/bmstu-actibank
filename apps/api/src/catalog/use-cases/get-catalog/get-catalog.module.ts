import { Module } from '@nestjs/common';
import { EventTypeRepositoryModule } from '../../infra/repository/event-type/event-type.module';
import { FormatRepositoryModule } from '../../infra/repository/format/format.module';
import { LevelRepositoryModule } from '../../infra/repository/level/level.module';
import { RankRepositoryModule } from '../../infra/repository/rank/rank.module';
import { ThemeRepositoryModule } from '../../infra/repository/theme/theme.module';
import { VenueRepositoryModule } from '../../infra/repository/venue/venue.module';
import { OrganizationRepositoryModule } from '../../infra/repository/organization/organization.module';
import { RoleRepositoryModule } from '../../infra/repository/role/role.module';
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
