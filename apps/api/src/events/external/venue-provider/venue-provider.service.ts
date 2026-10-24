import { Injectable } from '@nestjs/common';
import { GetVenuesHandler } from '../../use-cases/get-venues/get-venues.handler';
import { VenueDto } from './venue-provider.dto';
import { Result } from 'neverthrow';

export type VenueProviderError =
  | { kind: 'NotFound'; message: string }
  | { kind: 'RepositoryError'; message: string };

@Injectable()
export class VenueProvider {
  constructor(private readonly getVenueHandler: GetVenuesHandler) {}

  async getVenues(
    ids: string[],
  ): Promise<Result<VenueDto[], VenueProviderError>> {
    return this.getVenueHandler.execute({ ids });
  }
}
