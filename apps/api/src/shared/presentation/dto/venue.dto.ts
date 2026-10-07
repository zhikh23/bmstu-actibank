import { IsString, IsUUID, Length } from 'class-validator';

export class VenueDto {
  @IsUUID('4')
  declare id: string;

  @IsUUID('4')
  declare buildingId: string;

  @IsString()
  @Length(1, 64)
  declare name: string;
}
