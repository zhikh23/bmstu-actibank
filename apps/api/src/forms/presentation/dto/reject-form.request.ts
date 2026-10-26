import { ApiProperty } from '@nestjs/swagger';

export class RejectFormRequest {
  @ApiProperty({
    description: 'Причина отклонения формы',
    example: 'Необходимо уточнить место проведения мероприятия.',
    nullable: true,
  })
  declare reason?: string | null;
}
