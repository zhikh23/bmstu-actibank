import { Module } from '@nestjs/common';

import { RankRepositoryModule } from '@/catalog/infra/repository/rank/rank.module';

import { ResolveRanksHandler } from './resolve-ranks.handler';

@Module({
  imports: [RankRepositoryModule],
  providers: [ResolveRanksHandler],
  exports: [ResolveRanksHandler],
})
export class ResolveRanksModule {}
