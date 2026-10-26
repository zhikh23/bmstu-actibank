import { IsString, IsUUID, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrganizationCategoryDto {
  @ApiProperty({
    description: 'Идентификатор категории организации',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID('loose')
  declare id: string;

  @ApiProperty({
    description: 'Название категории организации',
    example: 'ответственный за направление',
  })
  @IsString()
  @Length(1, 128)
  declare name: string;

  @ApiProperty({
    description: 'Родительская категория, если она есть',
    type: OrganizationCategoryDto,
  })
  declare parent?: OrganizationCategoryDto | null;
}
