import { Module } from '@nestjs/common';

import { CatalogServiceModule } from './external/catalog-service.module';
import { CatalogController } from './presentation/catalog.controller';
import { CatalogService } from './presentation/catalog.service';
import { GetCatalogModule } from './use-cases/get-catalog/get-catalog.module';
import { GetEventTypeModule } from './use-cases/get-event-type/get-event-type.module';
import { GetFormatModule } from './use-cases/get-format/get-format.module';
import { GetLevelModule } from './use-cases/get-level/get-level.module';
import { GetOrganizationsModule } from './use-cases/get-organizations/get-organizations.module';
import { GetRanksModule } from './use-cases/get-ranks/get-ranks.module';
import { GetThemesModule } from './use-cases/get-themes/get-themes.module';
import { GetVenuesModule } from './use-cases/get-venues/get-venues.module';

@Module({
  imports: [
    GetEventTypeModule,
    GetFormatModule,
    GetLevelModule,
    GetThemesModule,
    GetVenuesModule,
    GetOrganizationsModule,
    GetRanksModule,
    CatalogServiceModule,
    GetCatalogModule,
  ],
  controllers: [CatalogController],
  providers: [CatalogService],
})
export class CatalogModule {}
