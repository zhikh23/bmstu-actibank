import { Injectable } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';

import { CatalogError } from '@/catalog/domain/errors';
import { LevelRepository } from '@/catalog/infra/repository/level/level.repository';

import { Level } from './get-level.data';

export type GetLevelQuery = {
  id: string;
};

@Injectable()
export class GetLevelHandler {
  constructor(private readonly repository: LevelRepository) {}

  execute(q: GetLevelQuery): ResultAsync<Level, CatalogError> {
    return this.repository.get(q.id);
  }
}
