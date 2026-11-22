import { Module } from '@nestjs/common';

import { VenueRepositoryModule } from '@/catalog/infra/repository/venue/venue.module';

import { GetBuildingVenues } from './get-building-venues.handler';

@Module({
  imports: [VenueRepositoryModule],
  providers: [GetBuildingVenues],
  exports: [GetBuildingVenues],
})
export class GetBuildingVenuesModule {}
