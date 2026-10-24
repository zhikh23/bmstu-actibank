import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, Length } from 'class-validator';

export class LevelDto {
  @ApiProperty({
    description: 'ID уровня проведения мероприятия',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID('loose')
  declare id: string;

  @ApiProperty({
    description: 'Текстовое обозначение уровня мероприятия',
    example: 'университет',
  })
  @IsString()
  @Length(1, 32)
  declare label: string;
}
