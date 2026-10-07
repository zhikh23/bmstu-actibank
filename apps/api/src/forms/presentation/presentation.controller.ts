import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { FormsService } from './presentation.service';
import { CreateFormRequest } from './dto/create-form.request';
import { CreateFormResponse } from './dto/create-form.response';
import { ApiOkResponse, ApiResponse } from '@nestjs/swagger';

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
}
