import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LevelModel } from './level.model';
import { LevelRepository } from './level.repository';

@Module({
  imports: [TypeOrmModule.forFeature([LevelModel])],
  providers: [LevelRepository],
  exports: [LevelRepository],
})
export class LevelRepositoryModule {}
