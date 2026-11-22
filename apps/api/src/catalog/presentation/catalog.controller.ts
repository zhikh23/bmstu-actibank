import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { BuildingDto } from '@/shared/presentation/dto/building.dto';
import { EventTypeDto } from '@/shared/presentation/dto/event-type.dto';
import { FormatDto } from '@/shared/presentation/dto/format.dto';
import { LevelDto } from '@/shared/presentation/dto/level.dto';
import { OrganizationWithCategoryDto } from '@/shared/presentation/dto/organization-with-category.dto';
import { OrganizationDto } from '@/shared/presentation/dto/organization.dto';
import { RankDto } from '@/shared/presentation/dto/rank.dto';
import { RoleCategoryDto } from '@/shared/presentation/dto/role-category.dto';
import { RoleWithCategoryDto } from '@/shared/presentation/dto/role-with-category.dto';
import { RoleDto } from '@/shared/presentation/dto/role.dto';
import { ThemeDto } from '@/shared/presentation/dto/theme.dto';
import { VenueDto } from '@/shared/presentation/dto/venue.dto';

import { ResolveOrganizationsRequest } from './dto/resolve-organizations.request';
import { ResolveRolesRequest } from './dto/resolve-roles.request';
import { ResolveVenuesRequest } from './dto/resolve-venues.request';
import { EventTypesService } from './event-types.service';
import { FormatsService } from './formats.service';
import { LevelsService } from './levels.service';
import { OrganizationsService } from './organizations.service';
import { RanksService } from './ranks.service';
import { RolesService } from './roles.service';
import { ThemesService } from './themes.service';
import { VenuesService } from './venues.service';

@ApiTags('Catalog')
@Controller('catalog')
@ApiInternalServerErrorResponse({ description: 'Ошибка чтения каталога.' })
export class CatalogController {
  constructor(
    private readonly eventTypes: EventTypesService,
    private readonly formats: FormatsService,
    private readonly levels: LevelsService,
    private readonly organizations: OrganizationsService,
    private readonly ranks: RanksService,
    private readonly roles: RolesService,
    private readonly themes: ThemesService,
    private readonly venues: VenuesService,
  ) {}

  @Get('buildings')
  @ApiOperation({
    summary: 'Получить все здания',
    description: 'Возвращает список зданий и корпусов, доступных для выбора.',
  })
  @ApiOkResponse({
    description: 'Здания успешно получены.',
    type: [BuildingDto],
  })
  getBuildings(): Promise<BuildingDto[]> {
    return this.venues.getAllBuildings();
  }

  @Get('buildings/:buildingId/venues')
  @ApiOperation({
    summary: 'Получить места проведения здания',
    description: 'Возвращает все места проведения, расположенные в здании.',
  })
  @ApiParam({
    name: 'buildingId',
    type: String,
    description: 'Идентификатор здания.',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @ApiOkResponse({
    description: 'Места проведения успешно получены.',
    type: [VenueDto],
  })
  @ApiNotFoundResponse({ description: 'Здание не найдено.' })
  getVenuesByBuildingId(
    @Param('buildingId') buildingId: string,
  ): Promise<VenueDto[]> {
    return this.venues.getBuildingVenues(buildingId);
  }

  @Post('venues/resolve')
  @ApiOperation({
    summary: 'Разрешить места проведения',
    description: 'Возвращает список мест проведения по их идентификаторам.',
  })
  @ApiOkResponse({
    description: 'Места проведения успешно разрешены.',
    type: [VenueDto],
  })
  resolveVenues(@Body() dto: ResolveVenuesRequest): Promise<VenueDto[]> {
    return this.venues.resolveVenues(dto.ids);
  }

  @Get('event-types')
  @ApiOperation({
    summary: 'Получить все типы мероприятия',
    description: 'Возвращает все доступные типы мероприятия.',
  })
  @ApiOkResponse({
    description: 'Типы мероприятия успешно получены.',
    type: [EventTypeDto],
  })
  getEventTypes(): Promise<EventTypeDto[]> {
    return this.eventTypes.getAllEventTypes();
  }

  @Get('formats')
  @ApiOperation({
    summary: 'Получить все форматы',
    description: 'Возвращает все доступные форматы проведения мероприятия.',
  })
  @ApiOkResponse({
    description: 'Форматы успешно получены.',
    type: [FormatDto],
  })
  getFormats(): Promise<FormatDto[]> {
    return this.formats.getAllFormats();
  }

  @Get('levels')
  @ApiOperation({
    summary: 'Получить все уровни',
    description: 'Возвращает все доступные уровни мероприятия.',
  })
  @ApiOkResponse({ description: 'Уровни успешно получены.', type: [LevelDto] })
  getLevels(): Promise<LevelDto[]> {
    return this.levels.getAllLevels();
  }

  @Get('organizations')
  @ApiOperation({
    summary: 'Получить все организации',
    description: 'Возвращает все доступные уровни организации.',
  })
  @ApiOkResponse({
    description: 'Организации успешно получены.',
    type: [OrganizationDto],
  })
  getOrganizations(): Promise<OrganizationDto[]> {
    return this.organizations.getAllOrganizations();
  }

  @Post('organizations/resolve')
  @ApiOperation({
    summary: 'Разрешить организации',
    description: 'Возвращает список организаций по их идентификаторам.',
  })
  @ApiOkResponse({
    description: 'Организации успешно разрешены.',
    type: [OrganizationWithCategoryDto],
  })
  resolveOrganizations(
    @Body() dto: ResolveOrganizationsRequest,
  ): Promise<OrganizationWithCategoryDto[]> {
    return this.organizations.resolveOrganizations(dto.ids);
  }

  @Get('ranks')
  @ApiOperation({
    summary: 'Получить все ранги гостей',
    description: 'Возвращает все доступные ранги гостей мероприятия.',
  })
  @ApiOkResponse({
    description: 'Ранги гостей успешно получены.',
    type: [RankDto],
  })
  getRanks(): Promise<RankDto[]> {
    return this.ranks.getAllRanks();
  }

  @Get('role-categories')
  @ApiOperation({
    summary: 'Получить все категории ролей',
    description: 'Возвращает все доступные категории ролей участников.',
  })
  @ApiOkResponse({
    description: 'Категории ролей успешно получены.',
    type: [RoleCategoryDto],
  })
  getRoleCategories(): Promise<RoleCategoryDto[]> {
    return this.roles.getAllRoleCategories();
  }

  @Get('role-categories/:categoryId/roles')
  @ApiOperation({
    summary: 'Получить роли категории',
    description: 'Возвращает все роли, относящиеся к заданной категории.',
  })
  @ApiParam({
    name: 'categoryId',
    type: String,
    description: 'Идентификатор категории роли.',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @ApiOkResponse({
    description: 'Роли категории успешно получены.',
    type: [RoleDto],
  })
  @ApiNotFoundResponse({ description: 'Категория роли не найдена.' })
  getCategoryRoles(
    @Param('categoryId') categoryId: string,
  ): Promise<RoleDto[]> {
    return this.roles.getCategoryRoles(categoryId);
  }

  @Post('roles/resolve')
  @ApiOperation({
    summary: 'Разрешить роли',
    description: 'Возвращает список ролей по их идентификаторам.',
  })
  @ApiOkResponse({
    description: 'Роли успешно разрешены.',
    type: [RoleWithCategoryDto],
  })
  resolveRoles(
    @Body() dto: ResolveRolesRequest,
  ): Promise<RoleWithCategoryDto[]> {
    return this.roles.resolveRoles(dto.ids);
  }

  @Get('themes')
  @ApiOperation({
    summary: 'Получить все темы',
    description: 'Возвращает все доступные темы мероприятий.',
  })
  @ApiOkResponse({ description: 'Темы успешно получены.', type: [ThemeDto] })
  getThemes(): Promise<ThemeDto[]> {
    return this.themes.getAllThemes();
  }
}
