import { ApiProperty } from '@nestjs/swagger';

export class ResolveRolesRequest {
  @ApiProperty({
    description: 'Список идентификаторов ролей.',
    example: ['00000000-0000-0000-0000-000000000000'],
  })
  declare ids: string[];
}
