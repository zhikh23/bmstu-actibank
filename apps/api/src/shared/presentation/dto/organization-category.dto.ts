import { IsString, IsUUID, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrganizationCategoryDto {
  @ApiProperty({
    description: 'ID категории организатора',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID('loose')
  declare id: string;

  @ApiProperty({
    description: 'Текстовое обозначение категории организаций',
    example: 'ответственный за направление',
  })
  @IsString()
  @Length(1, 128)
  declare name: string;

  @ApiProperty({
    description: 'Родительская категория',
    type: OrganizationCategoryDto,
  })
  declare parent?: OrganizationCategoryDto | null;
}
