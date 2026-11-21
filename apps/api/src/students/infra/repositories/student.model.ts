import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('students')
export class StudentModel {
  @PrimaryColumn('uuid')
  declare id: string;

  @Column('varchar')
  declare first_name: string;

  @Column('varchar')
  declare last_name: string;

  @Column('varchar', { nullable: true })
  declare middle_name: string | null;
}
