import { Injectable } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';

import { CatalogError } from '@/catalog/domain/errors';
import { ThemeRepository } from '@/catalog/infra/repository/theme/theme.repository';

import { ThemeType } from './resolve-themes.data';

export type ResolveThemesQuery = {
  ids: string[];
};

@Injectable()
export class ResolveThemesHandler {
  constructor(private readonly repository: ThemeRepository) {}

  execute(q: ResolveThemesQuery): ResultAsync<ThemeType[], CatalogError> {
    return this.repository.findByIds(q.ids);
  }
}
