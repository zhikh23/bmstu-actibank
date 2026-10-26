import { ApiProperty } from '@nestjs/swagger';
import { ParticipantsDto } from '../../../shared/presentation/dto/participant.dto';
import { VenueDto } from '../../../shared/presentation/dto/venue.dto';
import { ThemeDto } from '../../../shared/presentation/dto/theme.dto';
import { EventTypeDto } from '../../../shared/presentation/dto/event-type.dto';
import { FormatDto } from '../../../shared/presentation/dto/format.dto';
import { LevelDto } from '../../../shared/presentation/dto/level.dto';
import { RoleDto } from '../../../shared/presentation/dto/role.dto';
import { OrganizationDto } from '../../../shared/presentation/dto/organization.dto';
import { RankDto } from '../../../shared/presentation/dto/rank.dto';

export class GetFormGuestDto {
  @ApiProperty({
    description: 'Идентификатор пользователя-гостя',
    example: '00000000-0000-0000-0000-000000000000',
  })
  declare userId: string;

  @ApiProperty({
    description: 'Звание гостя',
    type: RankDto,
  })
  declare rank: RankDto;
}

export class GetFormMemberDto {
  @ApiProperty({
    description: 'Идентификатор пользователя — члена оргкомитета',
    example: '00000000-0000-0000-0000-000000000000',
  })
  declare userId: string;

  @ApiProperty({
    description: 'Роль члена оргкомитета',
    type: RoleDto,
  })
  declare role: RoleDto;
}

export class GetFormResponse {
  @ApiProperty({
    description: 'Идентификатор формы',
    example: '00000000-0000-0000-0000-000000000000',
  })
  declare id: string;

  @ApiProperty({
    description: 'Название мероприятия',
    example: 'IX Псевдонаучная конференция',
  })
  declare name: string;

  @ApiProperty({
    description: 'Описание мероприятия',
    example: 'Традиционная псевдонаучная конференция студентов',
  })
  declare description: string;

  @ApiProperty({
    description: 'Организации-организаторы мероприятия',
    type: [OrganizationDto],
  })
  declare organizers: OrganizationDto[];

  @ApiProperty({
    description: 'Ссылки на упоминания мероприятия',
    example: ['https://vk.ru/'],
  })
  declare links: string[];

  @ApiProperty({
    description: 'Места проведения мероприятия',
    type: [VenueDto],
  })
  declare venues: VenueDto[];

  @ApiProperty({
    description: 'Список тем, связанных с мероприятием',
    type: [ThemeDto],
  })
  declare themes: ThemeDto[];

  @ApiProperty({
    description: 'Дата и время начала мероприятия',
    example: '2026-01-01T17:00:00',
  })
  declare start: Date;

  @ApiProperty({
    description: 'Дата и время окончания мероприятия',
    example: '2026-01-01T17:00:00',
  })
  declare end: Date;

  @ApiProperty({
    description: 'Формат мероприятия',
    type: FormatDto,
  })
  declare format: FormatDto;

  @ApiProperty({
    description: 'Форма проведения мероприятия',
    type: EventTypeDto,
  })
  declare type: EventTypeDto;

  @ApiProperty({
    description: 'Уровень мероприятия',
    type: LevelDto,
  })
  declare level: LevelDto;

  @ApiProperty({
    description: 'Количество участников по категориям',
    type: ParticipantsDto,
  })
  declare participants: ParticipantsDto;

  @ApiProperty({
    description: 'Список гостей мероприятия',
    type: [GetFormGuestDto],
  })
  declare guests: GetFormGuestDto[];

  @ApiProperty({
    description: 'Члены оргкомитета и их роли',
    type: [GetFormMemberDto],
  })
  declare team: GetFormMemberDto[];

  @ApiProperty({
    description: 'Текущий статус формы',
    example: 'pending',
  })
  declare status: string;

  @ApiProperty({
    description: 'Причина отклонения формы, если она была отклонена',
    example: 'Данное мероприятие ещё не состоялось',
  })
  declare reason: string | null;

  @ApiProperty({
    description: 'Идентификатор пользователя-заявителя',
    example: '00000000-0000-0000-0000-000000000000',
  })
  declare submitterId: string;

  @ApiProperty({
    description: 'Идентификатор пользователя-модератора',
    example: '00000000-0000-0000-0000-000000000000',
  })
  declare reviewerId: string | null;

  @ApiProperty({
    description: 'Дата и время создания формы',
    example: '2026-01-01T10:00:00',
  })
  declare createdAt: string;

  @ApiProperty({
    description: 'Дата и время последнего обновления формы',
    example: '2026-01-01T10:00:00',
  })
  declare updatedAt: string;

  @ApiProperty({
    description: 'Дата и время рассмотрения формы модератором',
    example: '2026-01-01T10:00:00',
  })
  declare reviewedAt: string | null;

  @ApiProperty({
    description: 'Дата и время отмены формы',
    example: '2026-01-01T10:00:00',
  })
  declare canceledAt: string | null;
}
