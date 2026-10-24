import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuildingModel, VenueModel } from './venue.model';
import { VenueRepository } from './venue.repository';

@Module({
  imports: [TypeOrmModule.forFeature([VenueModel, BuildingModel])],
  providers: [VenueRepository],
  exports: [VenueRepository],
})
export class VenueRepositoryModule {}
