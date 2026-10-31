import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FormsService } from './forms.service';
import { CreateFormRequest } from './dto/create-form.request';
import { CreateFormResponse } from './dto/create-form.response';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { GetFormResponse } from './dto/get-form.response';
import { RejectFormRequest } from './dto/reject-form.request';
import { CurrentUser, Roles } from '../../auth/presentation/auth.decorators';
import { RolesGuard } from '../../auth/presentation/auth.guards';
import {
  AuthenticatedUser,
  UserRole,
} from '../../shared/domain/authenticated-user.entity';

@Controller('forms')
@ApiTags('Forms')
@ApiCookieAuth('actibank_session')
export class FormsController {
  constructor(private readonly formService: FormsService) {}

  @Post(':id/approve')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Одобрить форму',
    description: 'Одобряет форму по результатам проверки модератором.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Идентификатор формы.',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @ApiNoContentResponse({
    description: 'Форма успешно одобрена.',
  })
  @ApiBadRequestResponse({
    description: 'Форма не находится в состоянии, допускающем одобрение.',
  })
  @ApiForbiddenResponse({
    description: 'У пользователя нет прав на одобрение формы.',
  })
  @ApiNotFoundResponse({
    description: 'Форма с указанным идентификатором не найдена.',
  })
  @Roles(UserRole.Moderator)
  @UseGuards(RolesGuard)
  async approve(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    return this.formService.approve(user, id);
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Отменить форму',
    description: 'Отменяет форму по инициативе заявителя.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Идентификатор формы.',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @ApiNoContentResponse({
    description: 'Форма успешно отменена.',
  })
  @ApiBadRequestResponse({
    description: 'Форма не находится в состоянии, допускающем отмену.',
  })
  @ApiForbiddenResponse({
    description: 'У пользователя нет прав на отмену формы.',
  })
  @ApiNotFoundResponse({
    description: 'Форма с указанным идентификатором не найдена.',
  })
  @Roles(UserRole.Applicant)
  @UseGuards(RolesGuard)
  async cancel(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    return this.formService.cancel(user, id);
  }

  @Post(':id/convert-to-draft')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Конвертировать форму в черновик',
    description:
      'Переводит форму в состояние черновика, позволяя вносить изменения в её содержимое.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Идентификатор формы.',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @ApiNoContentResponse({
    description: 'Форма успешно помечена как черновик',
  })
  @ApiBadRequestResponse({
    description: 'Форма не находится в состоянии, допускающем эту операцию.',
  })
  @ApiForbiddenResponse({
    description: 'У пользователя нет прав на выполнение этой операции.',
  })
  @ApiNotFoundResponse({
    description: 'Форма с указанным идентификатором не найдена.',
  })
  @Roles(UserRole.Applicant, UserRole.Moderator)
  @UseGuards(RolesGuard)
  async convertToDraft(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    return this.formService.convertToDraft(user, id);
  }

  @Post('')
  @Roles(UserRole.Applicant)
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: 'Создать форму',
    description:
      'Создаёт форму мероприятия и возвращает идентификатор созданной формы.',
  })
  @ApiOkResponse({
    description: 'Форма успешно создана',
    type: CreateFormResponse,
  })
  @ApiBadRequestResponse({
    description: 'Переданы некорректные данные запроса.',
  })
  @ApiForbiddenResponse({
    description: 'У пользователя нет прав на создание формы мероприятия.',
  })
  @ApiUnprocessableEntityResponse({
    description: 'Данные формы нарушают бизнес-правила.',
  })
  async createForm(
    @Body() dto: CreateFormRequest,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<CreateFormResponse> {
    return this.formService.create(user, dto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Получить форму',
    description: 'Возвращает форму мероприятия по её идентификатору.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Идентификатор формы.',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @ApiOkResponse({
    description: 'Форма успешно найдена.',
    type: GetFormResponse,
  })
  @ApiForbiddenResponse({
    description: 'У пользователя нет прав на чтение формы.',
  })
  @ApiNotFoundResponse({
    description: 'Форма с указанным идентификатором не найдена.',
  })
  async getForm(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<GetFormResponse> {
    return this.formService.get(user, id);
  }

  @Post(':id/mark-ready')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Отметить форму готовой',
    description:
      'Переводит форму в состояние, в котором она готова к проверке модератором.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Идентификатор формы.',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @ApiNoContentResponse({
    description: 'Форма успешно помечена как готовая',
  })
  @ApiBadRequestResponse({
    description: 'Форма не находится в состоянии, допускающем эту операцию.',
  })
  @ApiForbiddenResponse({
    description: 'У пользователя нет прав на выполнение этой операции.',
  })
  @ApiNotFoundResponse({
    description: 'Форма с указанным идентификатором не найдена.',
  })
  @Roles(UserRole.Applicant)
  @UseGuards(RolesGuard)
  async markFormReady(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    return this.formService.markReady(user, id);
  }

  @Post(':id/reject')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Отклонить форму',
    description: 'Отклоняет форму по результатам проверки модератором.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Идентификатор формы.',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @ApiBody({
    description: 'Причина отклонения формы.',
    type: RejectFormRequest,
  })
  @ApiNoContentResponse({
    description: 'Форма успешно отклонена.',
  })
  @ApiBadRequestResponse({
    description: 'Форма не находится в состоянии, допускающем отклонение.',
  })
  @ApiForbiddenResponse({
    description: 'У пользователя нет прав на отклонение формы.',
  })
  @ApiNotFoundResponse({
    description: 'Форма с указанным идентификатором не найдена.',
  })
  @Roles(UserRole.Moderator)
  @UseGuards(RolesGuard)
  async reject(
    @Param('id') id: string,
    @Body() dto: RejectFormRequest,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    return this.formService.reject(user, id, dto);
  }

  @Post(':id/start-review')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Начать проверку формы',
    description: 'Переводит готовую форму в состояние проверки модератором.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Идентификатор формы.',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @ApiNoContentResponse({
    description: 'Проверка формы успешно начата.',
  })
  @ApiBadRequestResponse({
    description: 'Форма не находится в состоянии, допускающем начало проверки.',
  })
  @ApiForbiddenResponse({
    description: 'У пользователя нет прав на начало проверки формы.',
  })
  @ApiNotFoundResponse({
    description: 'Форма с указанным идентификатором не найдена.',
  })
  @Roles(UserRole.Moderator)
  @UseGuards(RolesGuard)
  async startReview(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    return this.formService.startReview(user, id);
  }
}
