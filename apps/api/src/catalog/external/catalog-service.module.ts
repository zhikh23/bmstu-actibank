import { Module } from '@nestjs/common';

import { GetEventTypeModule } from '@/catalog/use-cases/get-event-type/get-event-type.module';
import { GetFormatModule } from '@/catalog/use-cases/get-format/get-format.module';
import { GetLevelModule } from '@/catalog/use-cases/get-level/get-level.module';
import { ResolveOrganizationsModule } from '@/catalog/use-cases/resolve-organizations/resolve-organizations.module';
import { ResolveRanksModule } from '@/catalog/use-cases/resolve-ranks/resolve-ranks.module';
import { ResolveRolesModule } from '@/catalog/use-cases/resolve-roles/resolve-roles.module';
import { ResolveThemesModule } from '@/catalog/use-cases/resolve-themes/resolve-themes.module';
import { ResolveVenuesModule } from '@/catalog/use-cases/resolve-venues/resolve-venues.module';

import { CatalogService } from './catalog.service';

@Module({
  imports: [
    GetEventTypeModule,
    GetFormatModule,
    GetLevelModule,
    ResolveOrganizationsModule,
    ResolveRanksModule,
    ResolveRolesModule,
    ResolveThemesModule,
    ResolveVenuesModule,
  ],
  providers: [CatalogService],
  exports: [CatalogService],
})
export class CatalogServiceModule {}
