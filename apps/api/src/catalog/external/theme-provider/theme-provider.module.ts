import { Module } from '@nestjs/common';
import { ThemeProvider } from './theme-provider.service';
import { GetThemesModule } from '../../use-cases/get-themes/get-themes.module';

@Module({
  imports: [GetThemesModule],
  providers: [ThemeProvider],
  exports: [ThemeProvider],
})
export class ThemeProviderModule {}
