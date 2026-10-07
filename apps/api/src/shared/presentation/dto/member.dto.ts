import { IsUUID } from 'class-validator';

export class MemberDto {
  @IsUUID('4')
  declare userId: string;

  @IsUUID('4')
  declare roleId: string;
}
