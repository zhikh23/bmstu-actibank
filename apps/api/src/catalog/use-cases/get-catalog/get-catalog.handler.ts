import { Injectable } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';

import { Building } from '@/catalog/domain/building.entity';
import { CatalogError } from '@/catalog/domain/errors';
import { EventType } from '@/catalog/domain/event-type.entity';
import { Format } from '@/catalog/domain/format.entity';
import { Level } from '@/catalog/domain/level.entity';
import { Rank } from '@/catalog/domain/rank.entity';
import { Theme } from '@/catalog/domain/theme.entity';
import { EventTypeRepository } from '@/catalog/infra/repository/event-type/event-type.repository';
import { FormatRepository } from '@/catalog/infra/repository/format/format.repository';
import { LevelRepository } from '@/catalog/infra/repository/level/level.repository';
import { OrganizationCategory } from '@/catalog/infra/repository/organization/organization-with-category.read-model';
import { OrganizationRepository } from '@/catalog/infra/repository/organization/organization.repository';
import { RankRepository } from '@/catalog/infra/repository/rank/rank.repository';
import { RoleRepository } from '@/catalog/infra/repository/role/role.repository';
import { ThemeRepository } from '@/catalog/infra/repository/theme/theme.repository';
import { VenueWithBuilding } from '@/catalog/infra/repository/venue/venue-with-building.read-model';
import { VenueRepository } from '@/catalog/infra/repository/venue/venue.repository';

import {
  OrganizationType,
  RoleCategoryType,
  RoleWithCategoryType,
} from './get-catalog.data';

@Injectable()
export class GetCatalogHandler {
  constructor(
    private readonly eventTypes: EventTypeRepository,
    private readonly formats: FormatRepository,
    private readonly levels: LevelRepository,
    private readonly ranks: RankRepository,
    private readonly themes: ThemeRepository,
    private readonly venues: VenueRepository,
    private readonly organizations: OrganizationRepository,
    private readonly roles: RoleRepository,
  ) {}

  getBuildings(): ResultAsync<Building[], CatalogError> {
    return this.venues.getAllBuildings();
  }

  getEventTypes(): ResultAsync<EventType[], CatalogError> {
    return this.eventTypes.getAll();
  }

  getFormats(): ResultAsync<Format[], CatalogError> {
    return this.formats.getAll();
  }

  getLevels(): ResultAsync<Level[], CatalogError> {
    return this.levels.getAll();
  }

  getRanks(): ResultAsync<Rank[], CatalogError> {
    return this.ranks.getAllRanks();
  }

  getThemes(): ResultAsync<Theme[], CatalogError> {
    return this.themes.getAllThemes();
  }

  getOrganizationCategories(): ResultAsync<
    OrganizationCategory[],
    CatalogError
  > {
    return this.organizations.getRootCategories();
  }

  getOrganizationChildren(
    parentId: string,
  ): ResultAsync<OrganizationCategory[], CatalogError> {
    return this.organizations.getChildCategories(parentId);
  }

  getCategoryOrganizations(
    categoryId: string,
  ): ResultAsync<OrganizationType[], CatalogError> {
    return this.organizations.getByCategory(categoryId);
  }

  getOrganizations(): ResultAsync<OrganizationType[], CatalogError> {
    return this.organizations.getAll();
  }

  getRoleCategories(): ResultAsync<RoleCategoryType[], CatalogError> {
    return this.roles.getCategories();
  }

  getRoles(
    categoryId: string,
  ): ResultAsync<RoleWithCategoryType[], CatalogError> {
    return this.roles.getAllWithCategoryByCategory(categoryId);
  }

  getVenues(
    buildingId: string,
  ): ResultAsync<VenueWithBuilding[], CatalogError> {
    return this.venues.getAllWithBuilding(buildingId);
  }
}
