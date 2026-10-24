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
