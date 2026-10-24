import { Entity, ManyToOne, OneToMany, PrimaryColumn, Relation } from 'typeorm';
import { JoinColumn } from 'typeorm/browser';
import { Column } from 'typeorm/browser';

@Entity('buildings')
export class BuildingModel {
  @PrimaryColumn('uuid')
  declare id: string;

  @Column('varchar')
  declare name: string;

  @OneToMany(() => VenueModel, (venue) => venue.building, { cascade: true })
  declare venues: VenueModel[];
}

@Entity('venues')
export class VenueModel {
  @PrimaryColumn('uuid')
  declare id: string;

  @Column('uuid')
  declare building_id: string;

  @Column('varchar')
  declare name: string;

  @ManyToOne(() => BuildingModel, (building) => building.venues)
  @JoinColumn({ name: 'building_id' })
  declare building: Relation<BuildingModel>;
}
