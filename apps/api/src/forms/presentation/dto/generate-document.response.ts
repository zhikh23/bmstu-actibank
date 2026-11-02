import { ApiProperty } from '@nestjs/swagger';

export class GenerateDocumentResponse {
  @ApiProperty({
    description: 'Идентификатор сгенерированного документа',
    example: '00000000-0000-0000-0000-000000000000',
  })
  declare fileId: string;
}
