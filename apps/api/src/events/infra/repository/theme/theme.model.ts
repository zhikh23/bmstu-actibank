import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('events_themes')
export class ThemeModel {
  @PrimaryColumn('uuid')
  declare id: string;

  @Column('varchar')
  declare title: string;
}
