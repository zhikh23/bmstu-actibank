import { IsString, IsUUID, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RoleCategoryDto {
  @ApiProperty({
    description: 'ID категории роли',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID('loose')
  declare id: string;

  @ApiProperty({
    description: 'Текстовое обозначение категории ролей',
    example: 'ответственный за направление',
  })
  @IsString()
  @Length(1, 128)
  declare label: string;
}
