import { Injectable } from '@nestjs/common';
import { GetEventTypeHandler } from '../use-cases/get-event-type/get-event-type.handler';
import { GetFormatHandler } from '../use-cases/get-format/get-format.handler';
import { GetLevelHandler } from '../use-cases/get-level/get-level.handler';
import { GetRanksHandler } from '../use-cases/get-ranks/get-ranks.handler';
import { GetRolesHandler } from '../use-cases/get-roles/get-roles.handler';
import { GetOrganizationsHandler } from '../use-cases/get-organizations/get-organizations.handler';
import { ResultAsync } from 'neverthrow';
import {
  EventTypeDto,
  FormatDto,
  LevelDto,
  RankDto,
  RoleDto,
  ThemeDto,
  VenueDto,
} from './dto';
import { OrganizationDto } from '../../shared/presentation/dto/organization.dto';
import { GetThemesHandler } from '../use-cases/get-themes/get-themes.handler';
import { GetVenuesHandler } from '../use-cases/get-venues/get-venues.handler';

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
  ): ResultAsync<OrganizationDto[], CatalogServiceError> {
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
