import { Level } from '../../../domain/level.entity';
import { LevelModel } from './level.model';

export class LevelMapper {
  static toDomain(m: LevelModel): Level {
    return new Level(m.id, m.label);
  }
}
