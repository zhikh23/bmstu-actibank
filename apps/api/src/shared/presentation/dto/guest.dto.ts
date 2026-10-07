import { IsUUID } from 'class-validator';

export class GuestDto {
  @IsUUID('4')
  declare userId: string;

  @IsUUID('4')
  declare rankId: string;
}
