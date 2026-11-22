import { Injectable } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';

import { CatalogError } from '@/catalog/domain/errors';
import { VenueRepository } from '@/catalog/infra/repository/venue/venue.repository';

import { VenueWithBuilding } from './resolve-venues.data';

export type ResolveVenuesQuery = {
  ids: string[];
};

@Injectable()
export class ResolveVenuesHandler {
  constructor(private readonly venueRepository: VenueRepository) {}

  execute(
    q: ResolveVenuesQuery,
  ): ResultAsync<VenueWithBuilding[], CatalogError> {
    return this.venueRepository.findByIdsWithBuilding(q.ids);
  }
}
