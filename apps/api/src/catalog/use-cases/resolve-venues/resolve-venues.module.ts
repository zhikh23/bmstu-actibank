import { Module } from '@nestjs/common';

import { VenueRepositoryModule } from '@/catalog/infra/repository/venue/venue.module';
import { ResolveVenuesHandler } from '@/catalog/use-cases/resolve-venues/resolve-venues.handler';

@Module({
  imports: [VenueRepositoryModule],
  providers: [ResolveVenuesHandler],
  exports: [ResolveVenuesHandler],
})
export class ResolveVenuesModule {}
