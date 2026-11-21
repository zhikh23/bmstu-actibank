import { IsEnum, IsOptional } from 'class-validator';

import { FormStatus } from '@/forms/domain/status.enum';
import {
  ListFormsSortBy,
  ListFormsSortOrder,
} from '@/forms/use-cases/list-forms/list-forms.data';

export class ListFormsRequest {
  @IsOptional()
  @IsEnum(FormStatus)
  declare status?: FormStatus;

  @IsOptional()
  @IsEnum(['createdAt', 'start'])
  declare sortBy?: ListFormsSortBy;

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  declare sortOrder?: ListFormsSortOrder;
}
