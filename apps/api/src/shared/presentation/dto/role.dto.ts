import { IsString, IsUUID, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RoleCategoryDto } from './role-category.dto';

export class RoleDto {
  @ApiProperty({
    description: 'Идентификатор роли',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID('loose')
  declare id: string;

  @ApiProperty({
    description: 'Название роли',
    example: 'главный организатор',
  })
  @IsString()
  @Length(1, 128)
  declare name: string;

  @ApiProperty({
    description: 'Категория, к которой относится роль',
    type: RoleCategoryDto,
  })
  declare category: RoleCategoryDto;
}
