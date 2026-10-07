import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GuestDto {
  @ApiProperty({
    description: 'ID пользователя-гостя',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID('loose')
  declare userId: string;

  @ApiProperty({
    description: 'ID уровня гостя',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID('loose')
  declare rankId: string;
}
