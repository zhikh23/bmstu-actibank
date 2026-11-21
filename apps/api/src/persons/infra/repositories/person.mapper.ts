import { PersonEntity } from '../../domain/person.entity';
import { PersonModel } from './person.model';

export class PersonMapper {
  static toDomain(p: PersonModel): PersonEntity {
    return new PersonEntity(p.id, p.full_name);
  }
}
