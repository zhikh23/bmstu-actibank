import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
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
  ApiQuery,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { CurrentUser, Roles } from '@/auth/presentation/auth.decorators';
import { RolesGuard } from '@/auth/presentation/auth.guards';
import {
  AuthenticatedUser,
  UserRole,
} from '@/shared/domain/authenticated-user.entity';

import { AttachDocumentRequest } from './dto/attach-document.request';
import { CreateFormRequest } from './dto/create-form.request';
import { CreateFormResponse } from './dto/create-form.response';
import { GenerateDocumentResponse } from './dto/generate-document.response';
import { GetFormResponse } from './dto/get-form.response';
import { ListFormsRequest } from './dto/list-forms.request';
import { ListFormResponse } from './dto/list-forms.response';
import { RejectFormRequest } from './dto/reject-form.request';
import { UpdateFormRequest } from './dto/update-form.request';
import { FormsService } from './forms.service';

@Controller('forms')
@ApiTags('Forms')
@ApiCookieAuth('actibank_session')
export class FormsController {
  constructor(private readonly formService: FormsService) {}

  @Get()
  @Roles(UserRole.Applicant, UserRole.Moderator)
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: 'Получить доступные формы',
    description:
      'Возвращает краткую информацию о формах, доступных текущему пользователю.',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['draft', 'pending', 'approved', 'reviewing', 'canceled', 'rejected'],
    description: 'Фильтр по статусу формы.',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['createdAt', 'start'],
    description: 'Поле сортировки: дата создания или время начала формы.',
    example: 'createdAt',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Порядок сортировки.',
    example: 'desc',
  })
  @ApiOkResponse({
    description: 'Формы успешно найдены.',
    type: [ListFormResponse],
  })
  async listForms(
    @Query() req: ListFormsRequest,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ListFormResponse[]> {
    return this.formService.list(user, req);
  }

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

  @Post(':id/attach-document')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Прикрепить скан документа к форме',
    description:
      'Прикрепляет к форме ранее загруженный файл со сканом подписанного документа.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Идентификатор формы.',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @ApiBody({
    description: 'Идентификатор файла со сканом документа.',
    type: AttachDocumentRequest,
  })
  @ApiNoContentResponse({
    description: 'Скан документа успешно прикреплён к форме.',
  })
  @ApiBadRequestResponse({
    description: 'Переданы некорректные данные запроса.',
  })
  @ApiForbiddenResponse({
    description: 'У пользователя нет прав на прикрепление документа.',
  })
  @ApiNotFoundResponse({
    description: 'Форма с указанным идентификатором не найдена.',
  })
  @ApiUnprocessableEntityResponse({
    description: 'Документ нельзя прикрепить к форме.',
  })
  @Roles(UserRole.Applicant)
  @UseGuards(RolesGuard)
  async attachDocument(
    @Param('id') id: string,
    @Body() dto: AttachDocumentRequest,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    return this.formService.attach(user, id, dto);
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

  @Post(':id/generate')
  @ApiOperation({
    summary: 'Сгенерировать документ',
    description:
      'Генерирует документ для печати для указанной формы. Данный документ следует распечатать, поставить ' +
      'подпись заявителя и загрузить его скан в соответствующий метод с указанием той же формы.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Идентификатор формы.',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @ApiOkResponse({
    description: 'Документ успешно сгенерирован и прикреплен к форме.',
    type: GenerateDocumentResponse,
  })
  @ApiForbiddenResponse({
    description: 'У пользователя нет прав на чтение формы.',
  })
  @ApiNotFoundResponse({
    description: 'Форма с указанным идентификатором не найдена.',
  })
  async generateDocument(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<GenerateDocumentResponse> {
    return this.formService.generate(user, id);
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

  @Patch(':id')
  @ApiOperation({
    summary: 'Обновить форму',
    description:
      'Изменяет поля формы. Редактировать форму может только заявитель, и только пока она находится в состоянии черновика.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Идентификатор формы.',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @ApiOkResponse({
    description: 'Форма успешно обновлена.',
    type: GetFormResponse,
  })
  @ApiBadRequestResponse({
    description: 'Переданы некорректные данные запроса.',
  })
  @ApiForbiddenResponse({
    description: 'У пользователя нет прав на редактирование формы.',
  })
  @ApiNotFoundResponse({
    description: 'Форма с указанным идентификатором не найдена.',
  })
  @ApiUnprocessableEntityResponse({
    description: 'Данные формы нарушают бизнес-правила.',
  })
  @Roles(UserRole.Applicant)
  @UseGuards(RolesGuard)
  async updateForm(
    @Param('id') id: string,
    @Body() dto: UpdateFormRequest,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<GetFormResponse> {
    return this.formService.update(user, id, dto);
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
