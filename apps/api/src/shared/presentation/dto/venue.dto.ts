import { IsString, IsUUID, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BuildingDto } from './building.dto';

export class VenueDto {
  @ApiProperty({
    description: 'ID локации для проведения мероприятия',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID('loose')
  declare id: string;

  @ApiProperty({
    description:
      'Название места проведения мероприятия. Включает в себя наименьшую территориальную единицу, в рамках которой проходило мероприятие или его часть',
    example: '501ю',
  })
  @IsString()
  @Length(1, 64)
  declare name: string;

  @ApiProperty({
    description: 'Здание места проведения мероприятия',
    type: BuildingDto,
  })
  declare building: BuildingDto;
}
