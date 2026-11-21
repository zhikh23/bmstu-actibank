import { Module } from '@nestjs/common';

import { VenueRepositoryModule } from '@/catalog/infra/repository/venue/venue.module';

import { GetVenuesHandler } from './get-venues.handler';

@Module({
  imports: [VenueRepositoryModule],
  providers: [GetVenuesHandler],
  exports: [GetVenuesHandler],
})
export class GetVenuesModule {}
