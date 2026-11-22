import { Venue } from '@/catalog/domain/venue.entity';

import { VenueWithBuilding } from './venue-with-building.read-model';
import { VenueModel } from './venue.model';

export class VenueWithBuildingMapper {
  static toReadModel(m: VenueModel): VenueWithBuilding {
    return {
      id: m.id,
      name: m.name,
      building: {
        id: m.building.id,
        name: m.building.name,
      },
    };
  }
}

export class VenueMapper {
  static toDomain(m: VenueModel): Venue {
    return {
      id: m.id,
      buildingId: m.building.id,
      name: m.name,
    };
  }
}
