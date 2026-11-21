import { ApiProperty } from '@nestjs/swagger';

export class ListStudentsItemDto {
  @ApiProperty({
    description: 'Идентификатор личности',
    example: '00000000-0000-0000-0000-000000000000',
  })
  declare id: string;

  @ApiProperty({
    description: 'Полное имя человека',
    example: 'Иванов Иван Иванович',
  })
  declare fullName: string;
}

export type ListStudentsResponse = ListStudentsItemDto[];
