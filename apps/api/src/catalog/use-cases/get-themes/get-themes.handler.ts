import { Injectable } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';

import { CatalogError } from '@/catalog/domain/errors';
import { ThemeRepository } from '@/catalog/infra/repository/theme/theme.repository';

import { ThemeType } from './get-themes.data';

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
