import { ApiProperty } from '@nestjs/swagger';

import { BuildingDto } from '@/shared/presentation/dto/building.dto';
import { VenueDto } from '@/shared/presentation/dto/venue.dto';

export class VenueWithBuildingDto extends VenueDto {
  @ApiProperty({
    description: 'Здание, в котором находится место проведения',
    type: BuildingDto,
  })
  declare building: BuildingDto;
}
