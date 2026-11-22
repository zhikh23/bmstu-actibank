import { Injectable } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';

import { VenueWithBuildingDto } from '@/catalog/external/dto/venue-with-building-dto';
import { GetEventTypeHandler } from '@/catalog/use-cases/get-event-type/get-event-type.handler';
import { GetFormatHandler } from '@/catalog/use-cases/get-format/get-format.handler';
import { GetLevelHandler } from '@/catalog/use-cases/get-level/get-level.handler';
import { ResolveOrganizationsHandler } from '@/catalog/use-cases/resolve-organizations/resolve-organizations.handler';
import { ResolveRanksHandler } from '@/catalog/use-cases/resolve-ranks/resolve-ranks.handler';
import { ResolveRolesHandler } from '@/catalog/use-cases/resolve-roles/resolve-roles.handler';
import { ResolveThemesHandler } from '@/catalog/use-cases/resolve-themes/resolve-themes.handler';
import { ResolveVenuesHandler } from '@/catalog/use-cases/resolve-venues/resolve-venues.handler';

import {
  EventTypeDto,
  FormatDto,
  LevelDto,
  OrganizationWithCategoryDto,
  RankDto,
  RoleDto,
  ThemeDto,
} from './dto';

export type CatalogServiceError =
  | { kind: 'NotFound'; message: string }
  | { kind: 'RepositoryError'; message: string };

@Injectable()
export class CatalogService {
  constructor(
    private readonly eventType: GetEventTypeHandler,
    private readonly format: GetFormatHandler,
    private readonly level: GetLevelHandler,
    private readonly organizations: ResolveOrganizationsHandler,
    private readonly ranks: ResolveRanksHandler,
    private readonly roles: ResolveRolesHandler,
    private readonly themes: ResolveThemesHandler,
    private readonly venues: ResolveVenuesHandler,
  ) {}

  getEventType(id: string): ResultAsync<EventTypeDto, CatalogServiceError> {
    return this.eventType.execute({ id });
  }

  getFormat(id: string): ResultAsync<FormatDto, CatalogServiceError> {
    return this.format.execute({ id });
  }

  getLevel(id: string): ResultAsync<LevelDto, CatalogServiceError> {
    return this.level.execute({ id });
  }

  getOrganizations(
    ids: string[],
  ): ResultAsync<OrganizationWithCategoryDto[], CatalogServiceError> {
    return this.organizations.execute({ ids });
  }

  getRanks(ids: string[]): ResultAsync<RankDto[], CatalogServiceError> {
    return this.ranks.execute({ ids });
  }

  getRoles(ids: string[]): ResultAsync<RoleDto[], CatalogServiceError> {
    return this.roles.execute({ ids });
  }

  getThemes(ids: string[]): ResultAsync<ThemeDto[], CatalogServiceError> {
    return this.themes.execute({ ids });
  }

  getVenues(
    ids: string[],
  ): ResultAsync<VenueWithBuildingDto[], CatalogServiceError> {
    return this.venues.execute({ ids });
  }
}
