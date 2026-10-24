import { IsString, IsUUID, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RoleCategoryDto } from './role-category.dto';

export class RoleDto {
  @ApiProperty({
    description: 'ID роли',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID('loose')
  declare id: string;

  @ApiProperty({
    description: 'Текстовое обозначение роли',
    example: 'главный организатор',
  })
  @IsString()
  @Length(1, 128)
  declare label: string;

  @ApiProperty({
    description: 'Категория роли',
    type: RoleCategoryDto,
  })
  declare category: RoleCategoryDto;
}
