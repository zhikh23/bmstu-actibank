import { Format } from '../../../domain/format.entity';
import { FormatModel } from './format.model';

export class FormatMapper {
  static toDomain(m: FormatModel): Format {
    return new Format(m.id, m.label);
  }
}
