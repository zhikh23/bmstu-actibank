import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, Length } from 'class-validator';

export class ThemeDto {
  @ApiProperty({
    description: 'Идентификатор темы мероприятия',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID('loose')
  declare id: string;

  @ApiProperty({
    description: 'Название темы мероприятия',
    example: '501ю',
  })
  @IsString()
  @Length(1, 64)
  declare name: string;
}
