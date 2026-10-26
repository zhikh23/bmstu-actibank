import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RankModel } from './rank.model';
import { RankRepository } from './rank.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RankModel])],
  providers: [RankRepository],
  exports: [RankRepository],
})
export class RankRepositoryModule {}
