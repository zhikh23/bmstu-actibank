import { ApiProperty } from '@nestjs/swagger';

export class CreateFormResponse {
  @ApiProperty({
    description: 'Идентификатор созданной формы',
    example: '00000000-0000-0000-0000-000000000000',
  })
  declare formId: string;
}
