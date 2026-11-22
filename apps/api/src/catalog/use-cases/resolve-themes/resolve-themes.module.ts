import { Module } from '@nestjs/common';

import { ThemeRepositoryModule } from '@/catalog/infra/repository/theme/theme.module';

import { ResolveThemesHandler } from './resolve-themes.handler';

@Module({
  imports: [ThemeRepositoryModule],
  providers: [ResolveThemesHandler],
  exports: [ResolveThemesHandler],
})
export class ResolveThemesModule {}
