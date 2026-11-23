import { IsArray, IsDate, IsEnum, IsOptional } from 'class-validator';
import {
  ListEventsSortBy,
  ListEventsSortOrder,
} from '@/events/use-cases/list-events/list-events.handler';
import { Transform } from 'class-transformer';

export class ListEventsRequest {
  @IsOptional()
  @IsEnum(['name', 'start', 'createdAt'])
  declare sortBy?: ListEventsSortBy;

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  declare sortOrder?: ListEventsSortOrder;

  @IsOptional()
  @IsDate()
  declare start?: Date;

  @IsOptional()
  @IsDate()
  declare end?: Date;

  @IsOptional()
  declare search?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined) return undefined;
    return Array.isArray(value) ? value : [value];
  })
  @IsArray()
  declare organizerIds?: string[];

  @IsOptional()
  declare offset?: number;

  @IsOptional()
  declare limit?: number;
}
