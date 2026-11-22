import { Injectable } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';

import { CatalogError } from '@/catalog/domain/errors';
import { VenueRepository } from '@/catalog/infra/repository/venue/venue.repository';

import { VenueType } from './get-building-venues.data';

export type GetBuildingVenuesQuery = {
  buildingId: string;
};

@Injectable()
export class GetBuildingVenues {
  constructor(private readonly repository: VenueRepository) {}

  execute(q: GetBuildingVenuesQuery): ResultAsync<VenueType[], CatalogError> {
    return this.repository.getBuildingVenues(q.buildingId);
  }
}
