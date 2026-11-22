import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResultAsync, okAsync } from 'neverthrow';
import { In, Repository } from 'typeorm';

import { Building } from '@/catalog/domain/building.entity';
import { CatalogError } from '@/catalog/domain/errors';
import { Venue } from '@/catalog/domain/venue.entity';

import { VenueWithBuilding } from './venue-with-building.read-model';
import { VenueMapper, VenueWithBuildingMapper } from './venue.mapper';
import { BuildingModel, VenueModel } from './venue.model';

@Injectable()
export class VenueRepository {
  constructor(
    @InjectRepository(VenueModel)
    private readonly repository: Repository<VenueModel>,
    @InjectRepository(BuildingModel)
    private readonly buildingRepository: Repository<BuildingModel>,
  ) {}

  getAllBuildings(): ResultAsync<Building[], CatalogError> {
    return ResultAsync.fromPromise(
      this.buildingRepository.find(),
      (error): CatalogError =>
        CatalogError.repository(
          error instanceof Error ? error.message : String(error),
        ),
    ).map((models) =>
      models.map((model) => new Building(model.id, model.name)),
    );
  }

  findByIdsWithBuilding(
    ids: string[],
  ): ResultAsync<VenueWithBuilding[], CatalogError> {
    return ResultAsync.fromPromise(
      this.repository.find({
        where: { id: In(ids) },
        relations: {
          building: true,
        },
      }),
      (error): CatalogError =>
        CatalogError.repository(
          error instanceof Error ? error.message : String(error),
        ),
    ).andThen((models) => {
      // Сохранить изначальный порядок
      const byId = new Map(models.map((m) => [m.id, m]));
      return okAsync(
        ids.map((id) => {
          const model = byId.get(id);
          return model
            ? VenueWithBuildingMapper.toReadModel(model)
            : { id, name: '', building: { id: '', name: '' } };
        }),
      );
    });
  }

  getBuildingVenues(buildingId: string): ResultAsync<Venue[], CatalogError> {
    // TODO: Добавить проверку существования здания
    return ResultAsync.fromPromise(
      this.repository.find({
        where: { building_id: buildingId },
      }),
      (error): CatalogError =>
        CatalogError.repository(
          error instanceof Error ? error.message : String(error),
        ),
    ).map((models) => models.map(VenueMapper.toDomain));
  }
}
