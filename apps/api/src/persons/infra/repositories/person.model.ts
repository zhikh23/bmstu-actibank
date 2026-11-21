import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('persons')
export class PersonModel {
  @PrimaryColumn('uuid')
  declare id: string;

  @Column('varchar')
  declare full_name: string;
}
