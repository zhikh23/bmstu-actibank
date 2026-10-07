import { IsInt, Min } from 'class-validator';

export class ParticipantsDto {
  @IsInt()
  @Min(0)
  declare students: number;

  @IsInt()
  @Min(0)
  declare employees: number;

  @IsInt()
  @Min(0)
  declare others: number;
}
