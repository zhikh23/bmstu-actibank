import { Module } from '@nestjs/common';
import { GetLevelHandler } from './get-level.handler';
import { LevelRepositoryModule } from '../../infra/repository/level/level.module';

@Module({
  imports: [LevelRepositoryModule],
  providers: [GetLevelHandler],
  exports: [GetLevelHandler],
})
export class GetLevelModule {}
