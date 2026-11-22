import { Injectable } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';

import { CatalogError } from '@/catalog/domain/errors';
import { ThemeRepository } from '@/catalog/infra/repository/theme/theme.repository';

import { ThemeType } from './get-all-themes.data';

@Injectable()
export class GetAllThemesHandler {
  constructor(private readonly repository: ThemeRepository) {}

  execute(): ResultAsync<ThemeType[], CatalogError> {
    return this.repository.getAll();
  }
}
