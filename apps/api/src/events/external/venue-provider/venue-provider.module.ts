import { Module } from '@nestjs/common';
import { GetVenuesModule } from '../../use-cases/get-venues/get-venues.module';
import { VenueProvider } from './venue-provider.service';

@Module({
  imports: [GetVenuesModule],
  providers: [VenueProvider],
  exports: [VenueProvider],
})
export class VenueProviderModule {}
