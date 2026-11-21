import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ThemeModel } from './theme.model';
import { ThemeRepository } from './theme.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ThemeModel])],
  providers: [ThemeRepository],
  exports: [ThemeRepository],
})
export class ThemeRepositoryModule {}
