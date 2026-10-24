import { Injectable } from '@nestjs/common';
import { GetThemesHandler } from '../../use-cases/get-themes/get-themes.handler';
import { Result, err, ok } from 'neverthrow';
import { ThemeDto } from './theme-provider.dto';

export type ThemeProviderError = { kind: 'RepositoryError'; message: string };

@Injectable()
export class ThemeProvider {
  constructor(private readonly getThemesHandler: GetThemesHandler) {}

  async getThemes(
    ids: string[],
  ): Promise<Result<ThemeDto[], ThemeProviderError>> {
    const res = await this.getThemesHandler.execute({ ids });
    if (res.isErr()) {
      const error = res.error;
      switch (error.kind) {
        case 'RepositoryError':
          return err({ kind: error.kind, message: error.message });
        default:
          throw null;
      }
    }
    return ok(res.value);
  }
}
