import { Injectable } from '@nestjs/common';
import { Result } from 'neverthrow';
import { RankType } from './get-ranks.data';
import { CatalogError } from '../../domain/errors';
import { RankRepository } from '../../infra/repository/rank/rank.repository';

export type GetRanksQuery = {
  ids: string[];
};

@Injectable()
export class GetRanksHandler {
  constructor(private readonly rankRepository: RankRepository) {}

  async execute(q: GetRanksQuery): Promise<Result<RankType[], CatalogError>> {
    return this.rankRepository.getAll(q.ids);
  }
}
