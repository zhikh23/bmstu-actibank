import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, Length } from 'class-validator';

export class FormatDto {
  @ApiProperty({
    description: 'Идентификатор формата проведения',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID('loose')
  declare id: string;

  @ApiProperty({
    description: 'Название формата проведения',
    example: 'очный',
  })
  @IsString()
  @Length(1, 32)
  declare name: string;
}
