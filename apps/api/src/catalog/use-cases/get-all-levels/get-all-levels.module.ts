import { Module } from '@nestjs/common';

import { LevelRepositoryModule } from '@/catalog/infra/repository/level/level.module';

import { GetAllLevelsHandler } from './get-all-levels.handler';

@Module({
  imports: [LevelRepositoryModule],
  providers: [GetAllLevelsHandler],
  exports: [GetAllLevelsHandler],
})
export class GetAllLevelsModule {}
