import { ApiProperty } from '@nestjs/swagger';

export class ListEventsItem {
  @ApiProperty({
    description: 'Идентификатор мероприятия',
    example: '00000000-0000-0000-0000-000000000000',
  })
  declare id: string;

  @ApiProperty({
    description: 'Уникальный человеко-читаемый идентификатор мероприятия',
    example: '123ABC',
  })
  declare slug: string;

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
    description: 'Список идентификаторов организаторов мероприятия',
    example: ['00000000-0000-0000-0000-000000000000'],
  })
  declare organizers: string[];

  @ApiProperty({
    description: 'Дата и время начала мероприятия',
    example: '2026-01-01T17:00:00',
  })
  declare start: string;

  @ApiProperty({
    description: 'Дата и время окончания мероприятия',
    example: '2026-01-01T17:00:00',
  })
  declare end: string;

  @ApiProperty({
    description: 'Дата и время создания формы',
    example: '2026-01-01T17:00:00',
    format: 'date-time',
  })
  declare createdAt: string;
}

export type ListEventsResponse = ListEventsItem[];
