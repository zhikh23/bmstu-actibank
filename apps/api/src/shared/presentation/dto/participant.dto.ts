import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ParticipantsDto {
  @ApiProperty({
    description: 'Количество студентов МГТУ им. Н.Э. Баумана на мероприятии',
    example: 50,
  })
  @IsInt()
  @Min(0)
  declare students: number;

  @ApiProperty({
    description: 'Количество сотрудников МГТУ им. Н.Э. Баумана на мероприятии',
    example: 2,
  })
  @IsInt()
  @Min(0)
  declare employees: number;

  @ApiProperty({
    description: 'Количество участников не из МГТУ им. Н.Э. Баумана',
    example: 2,
  })
  @IsInt()
  @Min(0)
  declare others: number;
}
