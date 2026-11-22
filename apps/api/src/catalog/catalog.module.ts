import { Module } from '@nestjs/common';

import { CatalogController } from '@/catalog/presentation/catalog.controller';
import { EventTypesService } from '@/catalog/presentation/event-types.service';
import { FormatsService } from '@/catalog/presentation/formats.service';
import { LevelsService } from '@/catalog/presentation/levels.service';
import { OrganizationsService } from '@/catalog/presentation/organizations.service';
import { RanksService } from '@/catalog/presentation/ranks.service';
import { RolesService } from '@/catalog/presentation/roles.service';
import { ThemesService } from '@/catalog/presentation/themes.service';
import { VenuesService } from '@/catalog/presentation/venues.service';
import { GetAllBuildingsModule } from '@/catalog/use-cases/get-all-buildings/get-all-buildings.module';
import { GetAllEventTypesModule } from '@/catalog/use-cases/get-all-event-types/get-all-event-types.module';
import { GetAllFormatsModule } from '@/catalog/use-cases/get-all-formats/get-all-formats.module';
import { GetAllLevelsModule } from '@/catalog/use-cases/get-all-levels/get-all-levels.module';
import { GetAllOrganizationsModule } from '@/catalog/use-cases/get-all-organizations/get-all-organizations.module';
import { GetAllRanksModule } from '@/catalog/use-cases/get-all-ranks/get-all-ranks.module';
import { GetAllRoleCategoriesModule } from '@/catalog/use-cases/get-all-role-categories/get-all-role-categories.module';
import { GetAllThemesModule } from '@/catalog/use-cases/get-all-themes/get-all-themes.module';
import { GetBuildingVenuesModule } from '@/catalog/use-cases/get-building-venues/get-building-venues.module';
import { GetCategoryRolesModule } from '@/catalog/use-cases/get-category-roles/get-category-roles.module';
import { GetEventTypeModule } from '@/catalog/use-cases/get-event-type/get-event-type.module';
import { GetFormatModule } from '@/catalog/use-cases/get-format/get-format.module';
import { GetLevelModule } from '@/catalog/use-cases/get-level/get-level.module';
import { ResolveOrganizationsModule } from '@/catalog/use-cases/resolve-organizations/resolve-organizations.module';
import { ResolveRanksModule } from '@/catalog/use-cases/resolve-ranks/resolve-ranks.module';
import { ResolveRolesModule } from '@/catalog/use-cases/resolve-roles/resolve-roles.module';
import { ResolveThemesModule } from '@/catalog/use-cases/resolve-themes/resolve-themes.module';
import { ResolveVenuesModule } from '@/catalog/use-cases/resolve-venues/resolve-venues.module';

@Module({
  imports: [
    GetAllBuildingsModule,
    GetAllEventTypesModule,
    GetAllFormatsModule,
    GetAllLevelsModule,
    GetAllOrganizationsModule,
    GetAllRanksModule,
    GetAllRoleCategoriesModule,
    GetAllThemesModule,
    GetBuildingVenuesModule,
    GetCategoryRolesModule,
    GetEventTypeModule,
    GetFormatModule,
    GetLevelModule,
    ResolveOrganizationsModule,
    ResolveRanksModule,
    ResolveRolesModule,
    ResolveThemesModule,
    ResolveVenuesModule,
  ],
  controllers: [CatalogController],
  providers: [
    EventTypesService,
    FormatsService,
    LevelsService,
    OrganizationsService,
    RanksService,
    RolesService,
    ThemesService,
    VenuesService,
  ],
})
export class CatalogModule {}
