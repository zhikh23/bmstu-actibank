import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ranks')
export class RankModel {
  @PrimaryColumn('uuid')
  declare id: string;

  @Column('varchar')
  declare title: string;
}
