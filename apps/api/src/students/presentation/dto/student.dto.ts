import { ApiProperty } from '@nestjs/swagger';

export class StudentDto {
  @ApiProperty({
    description: 'Идентификатор студента',
    example: '00000000-0000-0000-0000-000000000000',
  })
  declare id: string;

  @ApiProperty({
    description: 'Имя студента',
    example: 'Иван',
  })
  declare firstName: string;

  @ApiProperty({
    description: 'Фамилия студента',
    example: 'Иванов',
  })
  declare lastName: string;

  @ApiProperty({
    description: 'Отчество студента',
    example: 'Иванович',
  })
  declare middleName?: string | undefined;

  @ApiProperty({
    description: 'Полное имя студента',
    example: 'Иванов Иван Иванович',
  })
  declare fullName: string;
}
