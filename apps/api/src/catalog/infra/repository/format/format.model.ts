import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('formats')
export class FormatModel {
  @PrimaryColumn('uuid')
  declare id: string;

  @Column('varchar')
  declare label: string;
}
