import { Module } from '@nestjs/common';

import { VenueRepositoryModule } from '@/catalog/infra/repository/venue/venue.module';

import { GetAllBuildingsHandler } from './get-all-buildings.handler';

@Module({
  imports: [VenueRepositoryModule],
  providers: [GetAllBuildingsHandler],
  exports: [GetAllBuildingsHandler],
})
export class GetAllBuildingsModule {}
