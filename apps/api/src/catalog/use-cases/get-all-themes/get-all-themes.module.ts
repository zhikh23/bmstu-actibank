import { Module } from '@nestjs/common';

import { ThemeRepositoryModule } from '@/catalog/infra/repository/theme/theme.module';

import { GetAllThemesHandler } from './get-all-themes.handler';

@Module({
  imports: [ThemeRepositoryModule],
  providers: [GetAllThemesHandler],
  exports: [GetAllThemesHandler],
})
export class GetAllThemesModule {}
