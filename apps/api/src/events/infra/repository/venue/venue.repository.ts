import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResultAsync, okAsync, errAsync } from 'neverthrow';
import { VenueModel } from './venue.model';
import { VenueWithBuilding } from './venue-with-building.read-model';
import { EventsError } from '../../../domain/errors';
import { VenueWithBuildingMapper } from './venue.mapper';

@Injectable()
export class VenueRepository {
  constructor(
    @InjectRepository(VenueModel)
    private readonly repository: Repository<VenueModel>,
  ) {}

  getWithBuilding(id: string): ResultAsync<VenueWithBuilding, EventsError> {
    return ResultAsync.fromPromise(
      this.repository.findOne({
        where: { id },
        relations: {
          building: true,
        },
      }),
      (error): EventsError =>
        EventsError.repository(
          error instanceof Error ? error.message : String(error),
        ),
    ).andThen((model) =>
      model
        ? okAsync(VenueWithBuildingMapper.toReadModel(model))
        : errAsync(EventsError.notFound(`venue with id "${id}" not found`)),
    );
  }
}
