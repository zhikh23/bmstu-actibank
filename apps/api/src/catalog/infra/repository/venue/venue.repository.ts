import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResultAsync, okAsync, errAsync } from 'neverthrow';
import { In, Repository } from 'typeorm';

import { Building } from '@/catalog/domain/building.entity';
import { CatalogError } from '@/catalog/domain/errors';

import { VenueWithBuilding } from './venue-with-building.read-model';
import { VenueWithBuildingMapper } from './venue.mapper';
import { BuildingModel } from './venue.model';
import { VenueModel } from './venue.model';

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

  getWithBuilding(id: string): ResultAsync<VenueWithBuilding, CatalogError> {
    return ResultAsync.fromPromise(
      this.repository.findOne({
        where: { id },
        relations: {
          building: true,
        },
      }),
      (error): CatalogError =>
        CatalogError.repository(
          error instanceof Error ? error.message : String(error),
        ),
    ).andThen((model) =>
      model
        ? okAsync(VenueWithBuildingMapper.toReadModel(model))
        : errAsync(CatalogError.notFound(`venue with id "${id}" not found`)),
    );
  }

  getAllWithBuildings(
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

  getAllWithBuilding(
    buildingId: string,
  ): ResultAsync<VenueWithBuilding[], CatalogError> {
    return ResultAsync.fromPromise(
      this.repository.find({
        where: { building_id: buildingId },
        relations: { building: true },
      }),
      (error): CatalogError =>
        CatalogError.repository(
          error instanceof Error ? error.message : String(error),
        ),
    ).map((models) => models.map(VenueWithBuildingMapper.toReadModel));
  }
}
