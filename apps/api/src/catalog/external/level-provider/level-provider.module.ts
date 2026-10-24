import { Module } from '@nestjs/common';
import { LevelProvider } from './level-provider.service';
import { GetLevelModule } from '../../use-cases/get-level/get-level.module';

@Module({
  imports: [GetLevelModule],
  providers: [LevelProvider],
  exports: [LevelProvider],
})
export class LevelProviderModule {}
