import {
  IsArray,
  IsISO8601,
  IsString,
  IsUUID,
  Length,
  ValidateNested,
} from 'class-validator';
import { ParticipantsDto } from '../../../shared/presentation/dto/participant.dto';
import { GuestDto } from '../../../shared/presentation/dto/guest.dto';
import { MemberDto } from '../../../shared/presentation/dto/member.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateFormRequest {
  @ApiProperty({
    description: 'Название мероприятия',
    example: 'IX Псевдонаучная конференция',
  })
  @IsString()
  @Length(3, 256)
  declare name: string;

  @ApiProperty({
    description: 'Описание мероприятия',
    example: 'Традиционная псевдонаучная конференция студентов',
  })
  @IsString()
  @Length(0, 2048)
  declare description: string;

  @ApiProperty({
    description:
      'Список организаций, которые приняли участие в организации мероприятия',
    example: ['00000000-0000-0000-0000-000000000000'],
  })
  @IsArray()
  @IsUUID('loose', { each: true })
  declare organizers: string[];

  @ApiProperty({
    description: 'Ссылки на упоминание мероприяти в социальных сетях',
    example: ['https://vk.ru/'],
  })
  @IsArray()
  @IsString({ each: true })
  declare links: string[];

  @ApiProperty({
    description: 'Места проведения мероприятия',
    example: ['00000000-0000-0000-0000-000000000000'],
  })
  @IsArray()
  @IsUUID('loose', { each: true })
  declare venues: string[];

  @ApiProperty({
    description: 'Список ID тем, связанных с мероприятием',
    example: ['00000000-0000-0000-0000-000000000000'],
  })
  @IsArray()
  @IsUUID('loose', { each: true })
  declare themes: string[];

  @ApiProperty({
    description: 'Дата и время начала мероприятия',
    example: '2026-01-01T17:00:00',
  })
  @IsISO8601()
  declare start: string;

  @ApiProperty({
    description: 'Дата и время конца мероприятия',
    example: '2026-01-01T19:00:00',
  })
  @IsISO8601()
  declare end: string;

  @ApiProperty({
    description: 'ID формата мероприятия',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID('loose')
  declare formatId: string;

  @ApiProperty({
    description: 'ID формы мероприятия',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID('loose')
  declare typeId: string;

  @ApiProperty({
    description: 'ID уровня мероприятия',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID('loose')
  declare levelId: string;

  @ApiProperty({ type: ParticipantsDto })
  @ValidateNested()
  @Type(() => ParticipantsDto)
  declare participants: ParticipantsDto;

  @ApiProperty({ type: [GuestDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GuestDto)
  declare guests: GuestDto[];

  @ApiProperty({ type: [MemberDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MemberDto)
  declare team: MemberDto[];

  @ApiProperty({
    description: 'ID заявителя',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID('loose')
  declare submitterId: string;
}
