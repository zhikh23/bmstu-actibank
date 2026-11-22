import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResultAsync, errAsync, okAsync } from 'neverthrow';
import { Repository } from 'typeorm';

import { CatalogError } from '@/catalog/domain/errors';
import { EventType } from '@/catalog/domain/event-type.entity';

import { EventTypeMapper } from './event-type.mapper';
import { EventTypeModel } from './event-type.model';

@Injectable()
export class EventTypeRepository {
  constructor(
    @InjectRepository(EventTypeModel)
    private readonly repository: Repository<EventTypeModel>,
  ) {}

  get(id: string): ResultAsync<EventType, CatalogError> {
    return ResultAsync.fromPromise(
      this.repository.findOne({
        where: { id },
      }),
      (error): CatalogError =>
        CatalogError.repository(
          error instanceof Error ? error.message : String(error),
        ),
    ).andThen((model) => {
      return model
        ? okAsync(EventTypeMapper.toDomain(model))
        : errAsync(CatalogError.notFound(`event type with "${id}" not found`));
    });
  }

  getAll(): ResultAsync<EventType[], CatalogError> {
    return ResultAsync.fromPromise(
      this.repository.find(),
      (error): CatalogError =>
        CatalogError.repository(
          error instanceof Error ? error.message : String(error),
        ),
    ).map((models) => models.map(EventTypeMapper.toDomain));
  }
}
