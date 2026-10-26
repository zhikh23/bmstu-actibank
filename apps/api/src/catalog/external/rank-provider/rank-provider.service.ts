import { Injectable } from '@nestjs/common';
import { Result, err, ok } from 'neverthrow';
import { GetRanksHandler } from '../../use-cases/get-ranks/get-ranks.handler';
import { RankDto } from './rank-provider.dto';

export type RankProviderError = { kind: 'RepositoryError'; message: string };

@Injectable()
export class RankProvider {
  constructor(private readonly getRanksHandler: GetRanksHandler) {}

  async getRanks(
    ids: string[],
  ): Promise<Result<RankDto[], RankProviderError>> {
    const res = await this.getRanksHandler.execute({ ids });
    if (res.isErr()) {
      const error = res.error;
      switch (error.kind) {
        case 'RepositoryError':
          return err({ kind: error.kind, message: error.message });
        default:
          throw null;
      }
    }
    return ok(res.value);
  }
}
