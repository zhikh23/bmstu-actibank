import { IsArray, IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
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
  @IsArray()
  @Transform(({ value }) =>
    value === undefined
      ? undefined
      : Array.isArray(value)
        ? value
        : String(value)
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
  )
  @IsString({ each: true })
  declare organizerIds?: string[];

  @IsOptional()
  declare offset?: number;

  @IsOptional()
  declare limit?: number;
}
