import { IsString, IsUUID, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ThemeDto {
  @ApiProperty({
    description: 'ID темы проведенного мероприятия',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID('loose')
  declare id: string;

  @ApiProperty({
    description: 'Текстовое обозначение темы мероприятия',
    example: '501ю',
  })
  @IsString()
  @Length(1, 64)
  declare title: string;
}
