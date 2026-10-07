import { Body, Controller, Post } from '@nestjs/common';
import { FormsService } from './presentation.service';
import { CreateFormRequest } from './dto/create-form.request';
import { CreateFormResponse } from './dto/create-form.response';

@Controller('forms')
export class FormsController {
  constructor(private readonly formService: FormsService) {}

  @Post('')
  async createForm(
    @Body() dto: CreateFormRequest,
  ): Promise<CreateFormResponse> {
    return this.formService.create(dto);
  }
}
