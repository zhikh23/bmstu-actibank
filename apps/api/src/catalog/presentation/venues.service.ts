import { Injectable } from '@nestjs/common';

import { CatalogService } from '@/catalog/presentation/catalog.service';
import { GetAllBuildingsHandler } from '@/catalog/use-cases/get-all-buildings/get-all-buildings.handler';
import { GetBuildingVenues } from '@/catalog/use-cases/get-building-venues/get-building-venues.handler';
import { ResolveVenuesHandler } from '@/catalog/use-cases/resolve-venues/resolve-venues.handler';
import { BuildingDto } from '@/shared/presentation/dto/building.dto';
import { VenueWithBuildingDto } from '@/shared/presentation/dto/venue-with-building.dto';
import { VenueDto } from '@/shared/presentation/dto/venue.dto';

@Injectable()
export class VenuesService extends CatalogService {
  constructor(
    private readonly allBuildings: GetAllBuildingsHandler,
    private readonly buildingVenues: GetBuildingVenues,
    private readonly venues: ResolveVenuesHandler,
  ) {
    super();
  }

  getAllBuildings(): Promise<BuildingDto[]> {
    return this.resolve(this.allBuildings.execute());
  }

  getBuildingVenues(buildingId: string): Promise<VenueDto[]> {
    return this.resolve(this.buildingVenues.execute({ buildingId }));
  }

  resolveVenues(ids: string[]): Promise<VenueWithBuildingDto[]> {
    return this.resolve(this.venues.execute({ ids }));
  }
}
