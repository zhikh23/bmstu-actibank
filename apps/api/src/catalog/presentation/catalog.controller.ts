import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ResultAsync } from 'neverthrow';
import { CatalogService } from './catalog.service';
import { CatalogError } from '../domain/errors';
import { BuildingDto } from '../../shared/presentation/dto/building.dto';
import { EventTypeDto } from '../../shared/presentation/dto/event-type.dto';
import { FormatDto } from '../../shared/presentation/dto/format.dto';
import { LevelDto } from '../../shared/presentation/dto/level.dto';
import { OrganizationCategoryDto } from '../../shared/presentation/dto/organization-category.dto';
import { RankDto } from '../../shared/presentation/dto/rank.dto';
import { RoleCategoryDto } from '../../shared/presentation/dto/role-category.dto';
import { ThemeDto } from '../../shared/presentation/dto/theme.dto';
import { VenueDto } from '../../shared/presentation/dto/venue.dto';
import { RoleDto } from '../../shared/presentation/dto/role.dto';
import { OrganizationDto } from '../../shared/presentation/dto/organization.dto';

@ApiTags('Catalog')
@Controller('catalog')
@ApiInternalServerErrorResponse({ description: 'Ошибка чтения каталога.' })
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

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
    return this.resolve(this.catalogService.getBuildings());
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
    return this.resolve(this.catalogService.getEventTypes());
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
    return this.resolve(this.catalogService.getFormats());
  }

  @Get('levels')
  @ApiOperation({
    summary: 'Получить все уровни',
    description: 'Возвращает все доступные уровни мероприятия.',
  })
  @ApiOkResponse({ description: 'Уровни успешно получены.', type: [LevelDto] })
  getLevels(): Promise<LevelDto[]> {
    return this.resolve(this.catalogService.getLevels());
  }

  @Get('organizations')
  @ApiOperation({
    summary: 'Получить все организации',
    description: 'Возвращает все доступные уровни организации.',
  })
  @ApiOkResponse({ description: 'Организации успешно получены.', type: [OrganizationDto] })
  getOrganizations(): Promise<OrganizationDto[]> {
    return this.resolve(this.catalogService.getOrganizations());
  }

  @Get('organization-categories')
  @ApiOperation({
    summary: 'Получить корневые категории организаций',
    description: 'Возвращает категории организаций верхнего уровня.',
  })
  @ApiOkResponse({
    description: 'Корневые категории успешно получены.',
    type: [OrganizationCategoryDto],
  })
  getOrganizationCategories(): Promise<OrganizationCategoryDto[]> {
    return this.resolve(this.catalogService.getOrganizationCategories());
  }

  @Get('organization-categories/:categoryId/children')
  @ApiOperation({
    summary: 'Получить дочерние категории организаций',
    description: 'Возвращает дочерние категории заданной категории.',
  })
  @ApiParam({
    name: 'categoryId',
    type: String,
    description: 'Идентификатор родительской категории.',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @ApiOkResponse({
    description: 'Дочерние категории успешно получены.',
    type: [OrganizationCategoryDto],
  })
  @ApiNotFoundResponse({ description: 'Категория организации не найдена.' })
  getOrganizationChildCategories(
    @Param('categoryId') categoryId: string,
  ): Promise<OrganizationCategoryDto[]> {
    return this.resolve(
      this.catalogService.getOrganizationChildCategories(categoryId),
    );
  }

  @Get('organization-categories/:categoryId/organizations')
  @ApiOperation({
    summary: 'Получить организации категории',
    description:
      'Возвращает все организации, относящиеся к заданной категории.',
  })
  @ApiParam({
    name: 'categoryId',
    type: String,
    description: 'Идентификатор категории организации.',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @ApiOkResponse({
    description: 'Организации категории успешно получены.',
    type: [OrganizationDto],
  })
  @ApiNotFoundResponse({ description: 'Категория организации не найдена.' })
  getOrganizationsByCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<OrganizationDto[]> {
    return this.resolve(
      this.catalogService.getOrganizationsByCategory(categoryId),
    );
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
    return this.resolve(this.catalogService.getRanks());
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
    return this.resolve(this.catalogService.getRoleCategories());
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
  getRolesByCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<RoleDto[]> {
    return this.resolve(this.catalogService.getRolesByCategory(categoryId));
  }

  @Get('themes')
  @ApiOperation({
    summary: 'Получить все темы',
    description: 'Возвращает все доступные темы мероприятий.',
  })
  @ApiOkResponse({ description: 'Темы успешно получены.', type: [ThemeDto] })
  getThemes(): Promise<ThemeDto[]> {
    return this.resolve(this.catalogService.getThemes());
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
  getVenuesByBuilding(
    @Param('buildingId') buildingId: string,
  ): Promise<VenueDto[]> {
    return this.resolve(this.catalogService.getVenuesByBuilding(buildingId));
  }

  private resolve<T>(result: ResultAsync<T, CatalogError>): Promise<T> {
    return result.match(
      (value) => value,
      (error) => {
        if (error.kind === 'NotFound')
          throw new NotFoundException(error.message);
        throw new InternalServerErrorException(error.message);
      },
    );
  }
}
