import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MemberDto {
  @ApiProperty({
    description: 'ID члена оргкомитета',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID('loose')
  declare userId: string;

  @ApiProperty({
    description: 'ID роли члена оргкомитета',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID('loose')
  declare roleId: string;
}
