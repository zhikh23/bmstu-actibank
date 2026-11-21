import { Module } from '@nestjs/common';

import { LevelRepositoryModule } from '@/catalog/infra/repository/level/level.module';

import { GetLevelHandler } from './get-level.handler';

@Module({
  imports: [LevelRepositoryModule],
  providers: [GetLevelHandler],
  exports: [GetLevelHandler],
})
export class GetLevelModule {}
