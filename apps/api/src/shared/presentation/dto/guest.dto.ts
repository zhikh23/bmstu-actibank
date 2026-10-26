import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GuestDto {
  @ApiProperty({
    description: 'Идентификатор пользователя-гостя',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID('loose')
  declare userId: string;

  @ApiProperty({
    description: 'Идентификатор звания гостя',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID('loose')
  declare rankId: string;
}
