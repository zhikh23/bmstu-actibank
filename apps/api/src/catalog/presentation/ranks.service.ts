import { Injectable } from '@nestjs/common';

import { GetAllRanksHandler } from '@/catalog/use-cases/get-all-ranks/get-all-ranks.handler';
import { RankDto } from '@/shared/presentation/dto/rank.dto';

import { CatalogService } from './catalog.service';

@Injectable()
export class RanksService extends CatalogService {
  constructor(private readonly allRanks: GetAllRanksHandler) {
    super();
  }

  getAllRanks(): Promise<RankDto[]> {
    return this.resolve(this.allRanks.execute());
  }
}
