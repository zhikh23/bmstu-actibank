import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('files')
export class FileModel {
  @PrimaryColumn('uuid')
  declare id: string;

  @Column('uuid')
  declare owner_id: string;

  @Column('varchar')
  declare storage_key: string;

  @Column('varchar')
  declare filename: string;

  @Column('varchar')
  declare content_type: string;

  @Column('integer')
  declare size: number;

  @Column('timestamptz')
  declare created_at: Date;
}
