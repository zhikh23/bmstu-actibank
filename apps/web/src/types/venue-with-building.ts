import { Building } from './building';
import { Venue } from './venue';

export interface VenueWithBuilding extends Venue {
  building: Building;
}
