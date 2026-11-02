import { Injectable } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';
import { RankType } from './get-ranks.data';
import { CatalogError } from '../../domain/errors';
import { RankRepository } from '../../infra/repository/rank/rank.repository';

export type GetRanksQuery = {
  ids: string[];
};

@Injectable()
export class GetRanksHandler {
  constructor(private readonly rankRepository: RankRepository) {}

  execute(q: GetRanksQuery): ResultAsync<RankType[], CatalogError> {
    return this.rankRepository.getAll(q.ids);
  }
}
