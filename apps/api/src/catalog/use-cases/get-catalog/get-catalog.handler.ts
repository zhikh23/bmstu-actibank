import { Injectable } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';
import { CatalogError } from '../../domain/errors';
import { EventType } from '../../domain/event-type.entity';
import { Format } from '../../domain/format.entity';
import { Level } from '../../domain/level.entity';
import { Rank } from '../../domain/rank.entity';
import { Theme } from '../../domain/theme.entity';
import { VenueWithBuilding } from '../../infra/repository/venue/venue-with-building.read-model';
import { VenueRepository } from '../../infra/repository/venue/venue.repository';
import { EventTypeRepository } from '../../infra/repository/event-type/event-type.repository';
import { FormatRepository } from '../../infra/repository/format/format.repository';
import { LevelRepository } from '../../infra/repository/level/level.repository';
import { RankRepository } from '../../infra/repository/rank/rank.repository';
import { ThemeRepository } from '../../infra/repository/theme/theme.repository';
import { OrganizationRepository } from '../../infra/repository/organization/organization.repository';
import { OrganizationCategory } from '../../infra/repository/organization/organization-with-category.read-model';
import { RoleRepository } from '../../infra/repository/role/role.repository';
import { Building } from '../../domain/building.entity';
import {
  RoleType,
  RoleCategoryType,
  OrganizationType,
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

  getRoles(categoryId: string): ResultAsync<RoleType[], CatalogError> {
    return this.roles.getAllByCategory(categoryId);
  }

  getVenues(
    buildingId: string,
  ): ResultAsync<VenueWithBuilding[], CatalogError> {
    return this.venues.getAllWithBuilding(buildingId);
  }
}
