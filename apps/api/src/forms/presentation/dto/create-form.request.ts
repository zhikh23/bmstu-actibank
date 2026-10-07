import {
  IsArray,
  IsISO8601,
  IsString,
  IsUUID,
  Length,
  ValidateNested,
} from 'class-validator';
import { VenueDto } from '../../../shared/presentation/dto/venue.dto';
import { ParticipantsDto } from '../../../shared/presentation/dto/participant.dto';
import { GuestDto } from '../../../shared/presentation/dto/guest.dto';
import { MemberDto } from '../../../shared/presentation/dto/member.dto';

export class CreateFormRequest {
  @IsString()
  @Length(3, 256)
  declare name: string;

  @IsString()
  @Length(2048)
  declare description: string;

  @IsArray()
  @IsUUID('4', { each: true })
  declare organizers: string[];

  @IsArray()
  @IsString({ each: true })
  declare links: string[];

  @IsArray()
  @ValidateNested({ each: true })
  declare venues: VenueDto[];

  @IsArray()
  @IsUUID('4', { each: true })
  declare themes: string[];

  @IsISO8601()
  declare start: string;

  @IsISO8601()
  declare end: string;

  @IsUUID('4')
  declare formatId: string;

  @IsUUID('4')
  declare typeId: string;

  @IsUUID('4')
  declare levelId: string;

  @ValidateNested()
  declare participants: ParticipantsDto;

  @IsArray()
  @ValidateNested({ each: true })
  declare guests: GuestDto[];

  @IsArray()
  @ValidateNested({ each: true })
  declare team: MemberDto[];

  @IsUUID('4')
  declare submitterId: string;
}
