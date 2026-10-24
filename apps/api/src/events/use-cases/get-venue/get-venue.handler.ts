import { Injectable } from '@nestjs/common';
import { Result } from 'neverthrow';
import { EventsError } from '../../domain/errors';
import { VenueRepository } from '../../infra/repository/venue/venue.repository';
import { VenueType } from './get-venue.data';

export type GetVenueQuery = {
  id: string;
};

@Injectable()
export class GetVenueHandler {
  constructor(private readonly venueRepository: VenueRepository) {}

  async execute(q: GetVenueQuery): Promise<Result<VenueType, EventsError>> {
    return this.venueRepository.getWithBuilding(q.id);
  }
}
