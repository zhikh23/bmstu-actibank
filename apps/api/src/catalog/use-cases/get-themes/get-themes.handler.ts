import { Injectable } from '@nestjs/common';
import { ThemeRepository } from '../../infra/repository/theme/theme.repository';
import { ResultAsync } from 'neverthrow';
import { ThemeType } from './get-themes.data';
import { CatalogError } from '../../domain/errors';

export type GetThemesQuery = {
  ids: string[];
};

@Injectable()
export class GetThemesHandler {
  constructor(private readonly themeRepository: ThemeRepository) {}

  execute(q: GetThemesQuery): ResultAsync<ThemeType[], CatalogError> {
    return this.themeRepository.getAll(q.ids);
  }
}
