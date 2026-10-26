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
    description: 'Идентификаторы организаций-организаторов',
    example: ['00000000-0000-0000-0000-000000000000'],
  })
  @IsArray()
  @IsUUID('loose', { each: true })
  declare organizers: string[];

  @ApiProperty({
    description: 'Ссылки на упоминания мероприятия',
    example: ['https://vk.ru/'],
  })
  @IsArray()
  @IsString({ each: true })
  declare links: string[];

  @ApiProperty({
    description: 'Идентификаторы мест проведения',
    example: ['00000000-0000-0000-0000-000000000000'],
  })
  @IsArray()
  @IsUUID('loose', { each: true })
  declare venues: string[];

  @ApiProperty({
    description: 'Идентификаторы тем мероприятия',
    example: ['00000000-0000-0000-0000-000000000000'],
  })
  @IsArray()
  @IsUUID('loose', { each: true })
  declare themes: string[];

  @ApiProperty({
    description: 'Дата и время начала мероприятия в формате ISO 8601',
    example: '2026-01-01T17:00:00',
  })
  @IsISO8601()
  declare start: string;

  @ApiProperty({
    description: 'Дата и время окончания мероприятия в формате ISO 8601',
    example: '2026-01-01T19:00:00',
  })
  @IsISO8601()
  declare end: string;

  @ApiProperty({
    description: 'Идентификатор формата мероприятия',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID('loose')
  declare formatId: string;

  @ApiProperty({
    description: 'Идентификатор формы проведения',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID('loose')
  declare typeId: string;

  @ApiProperty({
    description: 'Идентификатор уровня мероприятия',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID('loose')
  declare levelId: string;

  @ApiProperty({
    description: 'Количество участников по категориям',
    type: ParticipantsDto,
  })
  @ValidateNested()
  @Type(() => ParticipantsDto)
  declare participants: ParticipantsDto;

  @ApiProperty({ description: 'Гости мероприятия', type: [GuestDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GuestDto)
  declare guests: GuestDto[];

  @ApiProperty({
    description: 'Члены оргкомитета и их роли',
    type: [MemberDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MemberDto)
  declare team: MemberDto[];

  @ApiProperty({
    description: 'Идентификатор пользователя-заявителя',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID('loose')
  declare submitterId: string;
}
