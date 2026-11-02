import { Injectable } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';
import { CatalogError } from '../../domain/errors';
import { VenueRepository } from '../../infra/repository/venue/venue.repository';
import { VenueType } from './get-venues.data';

export type GetVenuesQuery = {
  ids: string[];
};

@Injectable()
export class GetVenuesHandler {
  constructor(private readonly venueRepository: VenueRepository) {}

  execute(q: GetVenuesQuery): ResultAsync<VenueType[], CatalogError> {
    return this.venueRepository.getAllWithBuildings(q.ids);
  }
}
