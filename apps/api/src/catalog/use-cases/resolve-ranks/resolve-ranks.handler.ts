import { Injectable } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';

import { CatalogError } from '@/catalog/domain/errors';
import { RankRepository } from '@/catalog/infra/repository/rank/rank.repository';

import { RankType } from './resolve-ranks.data';

export type ResolveRanksQuery = {
  ids: string[];
};

@Injectable()
export class ResolveRanksHandler {
  constructor(private readonly repository: RankRepository) {}

  execute(q: ResolveRanksQuery): ResultAsync<RankType[], CatalogError> {
    return this.repository.findByIds(q.ids);
  }
}
