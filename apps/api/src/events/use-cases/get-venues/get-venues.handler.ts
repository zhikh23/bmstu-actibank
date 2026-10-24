import { Injectable } from '@nestjs/common';
import { Result } from 'neverthrow';
import { EventsError } from '../../domain/errors';
import { VenueRepository } from '../../infra/repository/venue/venue.repository';
import { VenueType } from './get-venues.data';

export type GetVenuesQuery = {
  ids: string[];
};

@Injectable()
export class GetVenuesHandler {
  constructor(private readonly venueRepository: VenueRepository) {}

  async execute(q: GetVenuesQuery): Promise<Result<VenueType[], EventsError>> {
    return this.venueRepository.getAllWithBuildings(q.ids);
  }
}
