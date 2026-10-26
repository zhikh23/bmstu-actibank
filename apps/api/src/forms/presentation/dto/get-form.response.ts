import { ApiProperty } from '@nestjs/swagger';
import { ParticipantsDto } from '../../../shared/presentation/dto/participant.dto';
import { GuestDto } from '../../../shared/presentation/dto/guest.dto';
import { MemberDto } from '../../../shared/presentation/dto/member.dto';
import { VenueDto } from '../../../shared/presentation/dto/venue.dto';
import { ThemeDto } from '../../../shared/presentation/dto/theme.dto';
import { EventTypeDto } from '../../../shared/presentation/dto/event-type.dto';
import { FormatDto } from '../../../shared/presentation/dto/format.dto';
import { LevelDto } from '../../../shared/presentation/dto/level.dto';
import { RoleDto } from '../../../shared/presentation/dto/role.dto';
import { OrganizationDto } from '../../../shared/presentation/dto/organization.dto';

export class GetFormMemberDto {
  @ApiProperty({
    description: 'ID члена оргкомитета',
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
    description: 'ID формы',
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
    description:
      'Список организаций, которые приняли участие в организации мероприятия',
    type: [OrganizationDto],
  })
  declare organizers: OrganizationDto[];

  @ApiProperty({
    description: 'Ссылки на упоминание мероприяти в социальных сетях',
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
    description: 'Дата и время начала мероприятия',
    example: '2026-01-01T17:00:00',
  })
  declare end: Date;

  @ApiProperty({
    description: 'Формат мероприятия',
    type: FormatDto,
  })
  declare format: FormatDto;

  @ApiProperty({
    description: 'Форма мероприятия',
    type: EventTypeDto,
  })
  declare type: EventTypeDto;

  @ApiProperty({
    description: 'Уровень мероприятия',
    type: LevelDto,
  })
  declare level: LevelDto;

  @ApiProperty({ type: ParticipantsDto })
  declare participants: ParticipantsDto;

  @ApiProperty({ type: [GuestDto] })
  declare guests: GuestDto[];

  @ApiProperty({ type: [GetFormMemberDto] })
  declare team: GetFormMemberDto[];

  @ApiProperty({
    description: 'Статус формы',
    example: 'pending',
  })
  declare status: string;

  @ApiProperty({
    description: 'Причина, по которой заявка была отклонена модератором',
    example: 'Данное мероприятие ещё не состоялось',
  })
  declare reason: string | null;

  @ApiProperty({
    description: 'ID заявителя',
    example: '00000000-0000-0000-0000-000000000000',
  })
  declare submitterId: string;

  @ApiProperty({
    description: 'ID модератора, который совершает или совершил ревью',
    example: '00000000-0000-0000-0000-000000000000',
  })
  declare reviewerId: string | null;

  @ApiProperty({
    description: 'Время создания формы',
    example: '2026-01-01T10:00:00',
  })
  declare createdAt: string;

  @ApiProperty({
    description: 'Время последнего обновления формы',
    example: '2026-01-01T10:00:00',
  })
  declare updatedAt: string;

  @ApiProperty({
    description: 'Время принятия решения при просмотре формы модератором',
    example: '2026-01-01T10:00:00',
  })
  declare reviewedAt: string | null;

  @ApiProperty({
    description: 'Время отмены формы',
    example: '2026-01-01T10:00:00',
  })
  declare canceledAt: string | null;
}
