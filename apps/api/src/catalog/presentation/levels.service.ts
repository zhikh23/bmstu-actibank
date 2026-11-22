import { Injectable } from '@nestjs/common';

import { GetAllLevelsHandler } from '@/catalog/use-cases/get-all-levels/get-all-levels.handler';
import { LevelDto } from '@/shared/presentation/dto/level.dto';

import { CatalogService } from './catalog.service';

@Injectable()
export class LevelsService extends CatalogService {
  constructor(private readonly allLevels: GetAllLevelsHandler) {
    super();
  }

  getAllLevels(): Promise<LevelDto[]> {
    return this.resolve(this.allLevels.execute());
  }
}
