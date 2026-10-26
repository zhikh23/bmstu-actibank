import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('themes')
export class ThemeModel {
  @PrimaryColumn('uuid')
  declare id: string;

  @Column('varchar')
  declare name: string;
}
