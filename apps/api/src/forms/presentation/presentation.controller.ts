import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { FormsService } from './presentation.service';
import { CreateFormRequest } from './dto/create-form.request';
import { CreateFormResponse } from './dto/create-form.response';
import { ApiOkResponse, ApiParam, ApiResponse } from '@nestjs/swagger';
import { GetFormResponse } from './dto/get-form.response';

@Controller('forms')
export class FormsController {
  constructor(private readonly formService: FormsService) {}

  @Post('')
  @ApiOkResponse({
    description: 'Форма успешно создана',
    type: CreateFormResponse,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY })
  async createForm(
    @Body() dto: CreateFormRequest,
  ): Promise<CreateFormResponse> {
    return this.formService.create(dto);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Form ID',
  })
  @ApiOkResponse({
    description: 'Форма найдена',
    type: GetFormResponse,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  async getForm(@Param('id') id: string): Promise<GetFormResponse> {
    return this.formService.get(id);
  }
}
