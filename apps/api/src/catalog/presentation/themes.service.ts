import { Injectable } from '@nestjs/common';

import { GetAllThemesHandler } from '@/catalog/use-cases/get-all-themes/get-all-themes.handler';
import { RankDto } from '@/shared/presentation/dto/rank.dto';

import { CatalogService } from './catalog.service';

@Injectable()
export class ThemesService extends CatalogService {
  constructor(private readonly allThemes: GetAllThemesHandler) {
    super();
  }

  getAllThemes(): Promise<RankDto[]> {
    return this.resolve(this.allThemes.execute());
  }
}
