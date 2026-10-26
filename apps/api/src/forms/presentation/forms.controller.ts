import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { FormsService } from './forms.service';
import { CreateFormRequest } from './dto/create-form.request';
import { CreateFormResponse } from './dto/create-form.response';
import {
  ApiBadRequestResponse,
  ApiBody,
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

@Controller('forms')
@ApiTags('Forms')
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
  async approve(@Param('id') id: string): Promise<void> {
    return this.formService.approve(id);
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
  async cancel(@Param('id') id: string): Promise<void> {
    return this.formService.cancel(id);
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
  async convertToDraft(@Param('id') id: string): Promise<void> {
    return this.formService.convertToDraft(id);
  }

  @Post('')
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
  @ApiUnprocessableEntityResponse({
    description: 'Данные формы нарушают бизнес-правила.',
  })
  async createForm(
    @Body() dto: CreateFormRequest,
  ): Promise<CreateFormResponse> {
    return this.formService.create(dto);
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
    description: 'У пользователя нет прав на выполнение этой операции.',
  })
  @ApiNotFoundResponse({
    description: 'Форма с указанным идентификатором не найдена.',
  })
  async getForm(@Param('id') id: string): Promise<GetFormResponse> {
    return this.formService.get(id);
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
  async markFormReady(@Param('id') id: string): Promise<void> {
    return this.formService.markReady(id);
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
  async reject(
    @Param('id') id: string,
    @Body() dto: RejectFormRequest,
  ): Promise<void> {
    return this.formService.reject(id, dto);
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
  async startReview(@Param('id') id: string): Promise<void> {
    return this.formService.startReview(id);
  }
}
