import { EventType } from '../../../domain/event-type.entity';
import { EventTypeModel } from './event-type.model';

export class EventTypeMapper {
  static toDomain(m: EventTypeModel): EventType {
    return new EventType(m.id, m.label);
  }
}
