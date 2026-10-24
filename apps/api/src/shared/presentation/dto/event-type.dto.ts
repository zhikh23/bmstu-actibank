import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, Length } from 'class-validator';

export class EventTypeDto {
  @ApiProperty({
    description: 'ID формы проведения мероприятия',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID('loose')
  declare id: string;

  @ApiProperty({
    description: 'Текстовое обозначение формы проведения мероприятия',
    example: 'интеллектуальная игра',
  })
  @IsString()
  @Length(1, 64)
  declare label: string;
}
