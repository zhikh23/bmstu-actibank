import { Injectable } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';

import { CatalogError } from '@/catalog/domain/errors';
import { LevelRepository } from '@/catalog/infra/repository/level/level.repository';

import { LevelType } from './get-all-levels.data';

@Injectable()
export class GetAllLevelsHandler {
  constructor(private readonly repository: LevelRepository) {}

  execute(): ResultAsync<LevelType[], CatalogError> {
    return this.repository.getAll();
  }
}
