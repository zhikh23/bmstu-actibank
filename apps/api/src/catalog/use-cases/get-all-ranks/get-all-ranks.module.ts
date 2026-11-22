import { Module } from '@nestjs/common';

import { RankRepositoryModule } from '@/catalog/infra/repository/rank/rank.module';

import { GetAllRanksHandler } from './get-all-ranks.handler';

@Module({
  imports: [RankRepositoryModule],
  providers: [GetAllRanksHandler],
  exports: [GetAllRanksHandler],
})
export class GetAllRanksModule {}
