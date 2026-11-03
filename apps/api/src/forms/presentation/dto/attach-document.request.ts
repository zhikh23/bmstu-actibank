import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AttachDocumentRequest {
  @ApiProperty({
    description: 'Идентификатор загруженного файла со сканом документа',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID('loose')
  declare fileId: string;
}
