import { Injectable } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';
import { GetCatalogHandler } from '../use-cases/get-catalog/get-catalog.handler';
import { CatalogError } from '../domain/errors';
import { BuildingDto } from '../../shared/presentation/dto/building.dto';
import { EventTypeDto } from '../../shared/presentation/dto/event-type.dto';
import { FormatDto } from '../../shared/presentation/dto/format.dto';
import { LevelDto } from '../../shared/presentation/dto/level.dto';
import { RankDto } from '../../shared/presentation/dto/rank.dto';
import { ThemeDto } from '../../shared/presentation/dto/theme.dto';
import { OrganizationCategoryDto } from '../../shared/presentation/dto/organization-category.dto';
import { RoleCategoryDto } from '../../shared/presentation/dto/role-category.dto';
import { VenueDto } from '../../shared/presentation/dto/venue.dto';
import { OrganizationDto } from '../../shared/presentation/dto/organization.dto';
import { RoleWithCategoryDto } from '../../shared/presentation/dto/role-with-category.dto';

@Injectable()
export class CatalogService {
  constructor(private readonly getCatalog: GetCatalogHandler) {}

  getBuildings(): ResultAsync<BuildingDto[], CatalogError> {
    return this.getCatalog.getBuildings();
  }

  getEventTypes(): ResultAsync<EventTypeDto[], CatalogError> {
    return this.getCatalog.getEventTypes();
  }

  getFormats(): ResultAsync<FormatDto[], CatalogError> {
    return this.getCatalog.getFormats();
  }

  getLevels(): ResultAsync<LevelDto[], CatalogError> {
    return this.getCatalog.getLevels();
  }

  getRanks(): ResultAsync<RankDto[], CatalogError> {
    return this.getCatalog.getRanks();
  }

  getThemes(): ResultAsync<ThemeDto[], CatalogError> {
    return this.getCatalog.getThemes();
  }

  getOrganizationCategories(): ResultAsync<
    OrganizationCategoryDto[],
    CatalogError
  > {
    return this.getCatalog.getOrganizationCategories();
  }

  getOrganizationChildCategories(
    id: string,
  ): ResultAsync<OrganizationCategoryDto[], CatalogError> {
    return this.getCatalog.getOrganizationChildren(id);
  }

  getOrganizationsByCategory(
    id: string,
  ): ResultAsync<OrganizationDto[], CatalogError> {
    return this.getCatalog.getCategoryOrganizations(id);
  }

  getOrganizations(): ResultAsync<OrganizationDto[], CatalogError> {
    return this.getCatalog.getOrganizations();
  }

  getRoleCategories(): ResultAsync<RoleCategoryDto[], CatalogError> {
    return this.getCatalog.getRoleCategories();
  }

  getRolesByCategory(
    id: string,
  ): ResultAsync<RoleWithCategoryDto[], CatalogError> {
    return this.getCatalog.getRoles(id);
  }

  getVenuesByBuilding(id: string): ResultAsync<VenueDto[], CatalogError> {
    return this.getCatalog.getVenues(id);
  }
}
