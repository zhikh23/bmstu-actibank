import { Module } from '@nestjs/common';
import { RankRepositoryModule } from '../../infra/repository/rank/rank.module';
import { GetRanksHandler } from './get-ranks.handler';

@Module({
  imports: [RankRepositoryModule],
  providers: [GetRanksHandler],
  exports: [GetRanksHandler],
})
export class GetRanksModule {}
