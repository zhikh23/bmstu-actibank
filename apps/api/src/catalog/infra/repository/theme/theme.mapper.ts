import { Theme } from '@/catalog/domain/theme.entity';

import { ThemeModel } from './theme.model';

export class ThemeMapper {
  static toDomain(m: ThemeModel): Theme {
    return new Theme(m.id, m.name);
  }
}
