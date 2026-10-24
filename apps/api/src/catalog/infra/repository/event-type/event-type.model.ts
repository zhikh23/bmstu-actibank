import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('event_types')
export class EventTypeModel {
  @PrimaryColumn('uuid')
  declare id: string;

  @Column('varchar')
  declare label: string;
}
