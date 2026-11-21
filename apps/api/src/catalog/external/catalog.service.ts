import { Injectable } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';

import { GetEventTypeHandler } from '@/catalog/use-cases/get-event-type/get-event-type.handler';
import { GetFormatHandler } from '@/catalog/use-cases/get-format/get-format.handler';
import { GetLevelHandler } from '@/catalog/use-cases/get-level/get-level.handler';
import { GetOrganizationsHandler } from '@/catalog/use-cases/get-organizations/get-organizations.handler';
import { GetRanksHandler } from '@/catalog/use-cases/get-ranks/get-ranks.handler';
import { GetRolesHandler } from '@/catalog/use-cases/get-roles/get-roles.handler';
import { GetThemesHandler } from '@/catalog/use-cases/get-themes/get-themes.handler';
import { GetVenuesHandler } from '@/catalog/use-cases/get-venues/get-venues.handler';

import {
  EventTypeDto,
  FormatDto,
  LevelDto,
  OrganizationWithCategoryDto,
  RankDto,
  RoleDto,
  ThemeDto,
  VenueDto,
} from './dto';

export type CatalogServiceError =
  | { kind: 'NotFound'; message: string }
  | { kind: 'RepositoryError'; message: string };

@Injectable()
export class CatalogService {
  constructor(
    private readonly getEventTypeHandler: GetEventTypeHandler,
    private readonly getFormatHandler: GetFormatHandler,
    private readonly getLevelHandler: GetLevelHandler,
    private readonly getOrganizationsHandler: GetOrganizationsHandler,
    private readonly getRanksHandler: GetRanksHandler,
    private readonly getRolesHandler: GetRolesHandler,
    private readonly getThemesHandler: GetThemesHandler,
    private readonly getVenuesHandler: GetVenuesHandler,
  ) {}

  getEventType(id: string): ResultAsync<EventTypeDto, CatalogServiceError> {
    return this.getEventTypeHandler.execute({ id });
  }

  getFormat(id: string): ResultAsync<FormatDto, CatalogServiceError> {
    return this.getFormatHandler.execute({ id });
  }

  getLevel(id: string): ResultAsync<LevelDto, CatalogServiceError> {
    return this.getLevelHandler.execute({ id });
  }

  getOrganizations(
    ids: string[],
  ): ResultAsync<OrganizationWithCategoryDto[], CatalogServiceError> {
    return this.getOrganizationsHandler.execute({ ids });
  }

  getRanks(ids: string[]): ResultAsync<RankDto[], CatalogServiceError> {
    return this.getRanksHandler.execute({ ids });
  }

  getRoles(ids: string[]): ResultAsync<RoleDto[], CatalogServiceError> {
    return this.getRolesHandler.execute({ ids });
  }

  getThemes(ids: string[]): ResultAsync<ThemeDto[], CatalogServiceError> {
    return this.getThemesHandler.execute({ ids });
  }

  getVenues(ids: string[]): ResultAsync<VenueDto[], CatalogServiceError> {
    return this.getVenuesHandler.execute({ ids });
  }
}
