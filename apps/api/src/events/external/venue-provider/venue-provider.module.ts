import { Module } from '@nestjs/common';
import { GetVenueModule } from '../../use-cases/get-venue/get-venue.module';
import { VenueProvider } from './venue-provider.service';

@Module({
  imports: [GetVenueModule],
  providers: [VenueProvider],
  exports: [VenueProvider],
})
export class VenueProviderModule {}
