import { Injectable } from '@nestjs/common';
import { Result, err, ok } from 'neverthrow';
import { LevelDto } from './level-provider.dto';
import { GetLevelHandler } from '../../use-cases/get-level/get-level.handler';

export type LevelProviderError =
  | { kind: 'NotFound'; message: string }
  | { kind: 'RepositoryError'; message: string };

@Injectable()
export class LevelProvider {
  constructor(private readonly getLevelHandler: GetLevelHandler) {}

  async getLevel(id: string): Promise<Result<LevelDto, LevelProviderError>> {
    return this.getLevelHandler.execute({ id });
  }
}
