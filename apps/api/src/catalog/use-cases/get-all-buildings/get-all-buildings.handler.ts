import { Injectable } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';

import { CatalogError } from '@/catalog/domain/errors';
import { VenueRepository } from '@/catalog/infra/repository/venue/venue.repository';

import { BuildingType } from './get-all-buildings.data';

@Injectable()
export class GetAllBuildingsHandler {
  constructor(private readonly repository: VenueRepository) {}

  execute(): ResultAsync<BuildingType[], CatalogError> {
    return this.repository.getAllBuildings();
  }
}
