import { ApiProperty } from '@nestjs/swagger';

export class ResolveOrganizationsRequest {
  @ApiProperty({
    description: 'Список идентификаторов организаций.',
    example: ['00000000-0000-0000-0000-000000000000'],
  })
  declare ids: string[];
}
