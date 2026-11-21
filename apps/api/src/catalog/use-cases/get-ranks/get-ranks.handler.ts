import { Injectable } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';

import { CatalogError } from '@/catalog/domain/errors';
import { RankRepository } from '@/catalog/infra/repository/rank/rank.repository';

import { RankType } from './get-ranks.data';

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
