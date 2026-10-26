import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('levels')
export class LevelModel {
  @PrimaryColumn('uuid')
  declare id: string;

  @Column('varchar')
  declare name: string;
}
