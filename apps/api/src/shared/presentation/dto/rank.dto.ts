import { IsString, IsUUID, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RankDto {
  @ApiProperty({
    description: 'Идентификатор звания',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID('loose')
  declare id: string;

  @ApiProperty({
    description: 'Название звания',
    example: 'проректор',
  })
  @IsString()
  @Length(1, 64)
  declare name: string;
}
