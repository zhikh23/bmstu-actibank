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
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { GetFormResponse } from './dto/get-form.response';

@Controller('forms')
@ApiTags('Forms')
export class FormsController {
  constructor(private readonly formService: FormsService) {}

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
  @ApiNotFoundResponse({
    description: 'Форма с указанным идентификатором не найдена.',
  })
  @ApiBadRequestResponse({
    description: 'Форма не находится в состоянии, допускающем эту операцию.',
  })
  async markFormReady(@Param('id') id: string): Promise<void> {
    return this.formService.markReady(id);
  }
}
