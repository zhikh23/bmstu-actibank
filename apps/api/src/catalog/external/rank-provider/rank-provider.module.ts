import { Module } from '@nestjs/common';
import { RankProvider } from './rank-provider.service';
import { GetRanksModule } from '../../use-cases/get-ranks/get-ranks.module';

@Module({
  imports: [GetRanksModule],
  providers: [RankProvider],
  exports: [RankProvider],
})
export class RankProviderModule {}
