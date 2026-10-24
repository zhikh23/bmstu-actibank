import { Module } from '@nestjs/common';
import { ThemeRepositoryModule } from '../../infra/repository/theme/theme.module';
import { GetThemesHandler } from './get-themes.handler';

@Module({
  imports: [ThemeRepositoryModule],
  providers: [GetThemesHandler],
  exports: [GetThemesHandler],
})
export class GetThemesModule {}
