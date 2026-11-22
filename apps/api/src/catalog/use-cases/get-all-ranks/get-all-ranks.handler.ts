import { Injectable } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';

import { CatalogError } from '@/catalog/domain/errors';
import { RankRepository } from '@/catalog/infra/repository/rank/rank.repository';

import { RankType } from './get-all-ranks.data';

@Injectable()
export class GetAllRanksHandler {
  constructor(private readonly repository: RankRepository) {}

  execute(): ResultAsync<RankType[], CatalogError> {
    return this.repository.getAll();
  }
}
