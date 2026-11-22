import { ApiProperty } from '@nestjs/swagger';

export class ConvertToDraftRequest {
  @ApiProperty({
    description: 'Причина от модератора для перевода заявки в черновик',
    example: 'Не указаны места проведения мероприятия',
  })
  declare reason?: string | undefined;
}
