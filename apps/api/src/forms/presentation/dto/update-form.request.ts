import { PartialType } from '@nestjs/swagger';
import { CreateFormRequest } from './create-form.request';

export class UpdateFormRequest extends PartialType(CreateFormRequest) {}
