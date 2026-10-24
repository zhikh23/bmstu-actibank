import { Injectable } from '@nestjs/common';
import { GetVenueHandler } from '../../use-cases/get-venue/get-venue.handler';
import { VenueDto } from './venue-provider.dto';
import { Result } from 'neverthrow';

export type VenueProviderError =
  | { kind: 'NotFound'; message: string }
  | { kind: 'RepositoryError'; message: string };

@Injectable()
export class VenueProvider {
  constructor(private readonly getVenueHandler: GetVenueHandler) {}

  async getVenue(id: string): Promise<Result<VenueDto, VenueProviderError>> {
    return this.getVenueHandler.execute({ id: id });
  }
}
