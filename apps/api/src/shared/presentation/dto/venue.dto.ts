import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, Length } from 'class-validator';

export class VenueDto {
  @ApiProperty({
    description: 'Идентификатор места проведения',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID('loose')
  declare id: string;

  @ApiProperty({
    description: 'Название аудитории или другого места проведения',
    example: '501ю',
  })
  @IsString()
  @Length(1, 64)
  declare name: string;
}
