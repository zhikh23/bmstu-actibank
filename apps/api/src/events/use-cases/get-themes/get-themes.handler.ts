import { Injectable } from '@nestjs/common';
import { ThemeRepository } from '../../infra/repository/theme/theme.repository';
import { Result } from 'neverthrow';
import { ThemeType } from './get-themes.data';
import { EventsError } from '../../domain/errors';

export type GetThemesQuery = {
  ids: string[];
};

@Injectable()
export class GetThemesHandler {
  constructor(private readonly themeRepository: ThemeRepository) {}

  async execute(q: GetThemesQuery): Promise<Result<ThemeType[], EventsError>> {
    return this.themeRepository.getAll(q.ids);
  }
}
