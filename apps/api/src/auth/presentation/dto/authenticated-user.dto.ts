import { ApiProperty } from '@nestjs/swagger';

import { UserRole } from '@/shared/domain/authenticated-user.entity';

export class AuthenticatedUserDto {
  @ApiProperty({
    description: 'Идентификатор пользователя',
    example: '00000000-0000-0000-0000-000000000000',
  })
  declare id: string;

  @ApiProperty({
    description: 'Идентификатор пользователя в OIDC-провайдере',
    example: '00000000-0000-0000-0000-000000000000',
  })
  declare subject: string;

  @ApiProperty({
    description: 'Список ролей пользователя',
    enum: UserRole,
    isArray: true,
  })
  declare roles: UserRole[];
}
