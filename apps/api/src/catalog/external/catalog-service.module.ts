import { Module } from '@nestjs/common';

import { GetEventTypeModule } from '@/catalog/use-cases/get-event-type/get-event-type.module';
import { GetFormatModule } from '@/catalog/use-cases/get-format/get-format.module';
import { GetLevelModule } from '@/catalog/use-cases/get-level/get-level.module';
import { GetOrganizationsModule } from '@/catalog/use-cases/get-organizations/get-organizations.module';
import { GetRanksModule } from '@/catalog/use-cases/get-ranks/get-ranks.module';
import { GetRolesModule } from '@/catalog/use-cases/get-roles/get-roles.module';
import { GetThemesModule } from '@/catalog/use-cases/get-themes/get-themes.module';
import { GetVenuesModule } from '@/catalog/use-cases/get-venues/get-venues.module';

import { CatalogService } from './catalog.service';

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
