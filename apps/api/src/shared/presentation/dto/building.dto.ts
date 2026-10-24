import { IsString, IsUUID, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BuildingDto {
  @ApiProperty({
    description: 'ID здания проведения мероприятия',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID('loose')
  declare id: string;

  @ApiProperty({
    description:
      'Название здания или иной структурно объединяющей единицы места проведения площадки',
    example: 'ГУК',
  })
  @IsString()
  @Length(1, 64)
  declare name: string;
}
