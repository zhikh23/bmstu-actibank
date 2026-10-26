import { Rank } from '../../../domain/rank.entity';
import { RankModel } from './rank.model';

export class RankMapper {
  static toDomain(m: RankModel): Rank {
    return new Rank(m.id, m.name);
  }
}
