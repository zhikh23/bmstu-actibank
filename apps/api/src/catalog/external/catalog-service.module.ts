import { Module } from '@nestjs/common';
import { GetEventTypeModule } from '../use-cases/get-event-type/get-event-type.module';
import { GetFormatModule } from '../use-cases/get-format/get-format.module';
import { GetLevelModule } from '../use-cases/get-level/get-level.module';
import { GetThemesModule } from '../use-cases/get-themes/get-themes.module';
import { GetVenuesModule } from '../use-cases/get-venues/get-venues.module';
import { GetOrganizationsModule } from '../use-cases/get-organizations/get-organizations.module';
import { GetRanksModule } from '../use-cases/get-ranks/get-ranks.module';
import { CatalogService } from './catalog.service';
import { GetRolesModule } from '../use-cases/get-roles/get-roles.module';

@Module({
  imports: [
    GetEventTypeModule,
    GetFormatModule,
    GetLevelModule,
    GetOrganizationsModule,
    GetRolesModule,
    GetRanksModule,
    GetThemesModule,
    GetVenuesModule,
  ],
  providers: [CatalogService],
  exports: [CatalogService],
})
export class CatalogServiceModule {}
