import { ApiProperty } from '@nestjs/swagger';

export class UploadFileResponse {
  @ApiProperty({
    description: 'ID загруженного файла',
    example: '00000000-0000-0000-0000-000000000000',
  })
  declare fileId: string;
}
