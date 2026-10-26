import { IsString, IsUUID, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RoleCategoryDto } from './role-category.dto';
import { OrganizationCategoryDto } from './organization-category.dto';

export class OrganizationDto {
  @ApiProperty({
    description: 'Идентификатор организации',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID('loose')
  declare id: string;

  @ApiProperty({
    description: 'Название организации',
    example: 'Студенческий клуб околонаучных изобретений',
  })
  @IsString()
  @Length(1, 128)
  declare name: string;

  @ApiProperty({
    description: 'Категория, к которой относится организация',
    type: OrganizationCategoryDto,
  })
  declare category: OrganizationCategoryDto;
}
