import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, Length } from 'class-validator';

export class BuildingDto {
  @ApiProperty({
    description: 'Идентификатор здания',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID('loose')
  declare id: string;

  @ApiProperty({
    description: 'Название здания или корпуса',
    example: 'ГУК',
  })
  @IsString()
  @Length(1, 64)
  declare name: string;
}
