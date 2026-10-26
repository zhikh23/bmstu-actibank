import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MemberDto {
  @ApiProperty({
    description: 'Идентификатор пользователя - члена оргкомитета',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID('loose')
  declare userId: string;

  @ApiProperty({
    description: 'Идентификатор роли члена оргкомитета',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID('loose')
  declare roleId: string;
}
