import { Module } from '@nestjs/common';
import { VenueRepositoryModule } from '../../infra/repository/venue/venue.module';
import { GetVenueHandler } from './get-venue.handler';

@Module({
  imports: [VenueRepositoryModule],
  providers: [GetVenueHandler],
  exports: [GetVenueHandler],
})
export class GetVenueModule {}
