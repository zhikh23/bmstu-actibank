import { Injectable } from '@nestjs/common';
import { Result } from 'neverthrow';
import { Level } from './get-level.data';
import { CatalogError } from '../../domain/errors';
import { LevelRepository } from '../../infra/repository/level/level.repository';

export type GetLevelQuery = {
  id: string;
};

@Injectable()
export class GetLevelHandler {
  constructor(private readonly repository: LevelRepository) {}

  async execute(q: GetLevelQuery): Promise<Result<Level, CatalogError>> {
    return this.repository.get(q.id);
  }
}
