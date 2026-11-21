import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, Length } from 'class-validator';

export class RoleCategoryDto {
  @ApiProperty({
    description: 'Идентификатор категории роли',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @IsUUID('loose')
  declare id: string;

  @ApiProperty({
    description: 'Название категории роли',
    example: 'ответственный за направление',
  })
  @IsString()
  @Length(1, 128)
  declare name: string;
}
