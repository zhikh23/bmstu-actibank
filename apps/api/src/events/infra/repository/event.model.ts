import type { Relation } from 'typeorm';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@Entity('events_organizers')
export class EventOrganizerModel {
  @PrimaryColumn('uuid')
  declare event_id: string;

  @PrimaryColumn('integer')
  declare number: number;

  @Column('uuid')
  declare organizer_id: string;

  @ManyToOne(() => EventModel, (event) => event.organizers)
  @JoinColumn({ name: 'event_id' })
  declare event: Relation<EventModel>;
}

@Entity('events_links')
export class EventLinkModel {
  @PrimaryColumn('uuid')
  declare event_id: string;

  @PrimaryColumn('integer')
  declare number: number;

  @Column('varchar')
  declare link: string;

  @ManyToOne(() => EventModel, (event) => event.links)
  @JoinColumn({ name: 'event_id' })
  declare event: Relation<EventModel>;
}

@Entity('events_venues')
export class EventVenueModel {
  @PrimaryColumn('uuid')
  declare event_id: string;

  @PrimaryColumn('integer')
  declare number: number;

  @Column('uuid')
  declare venue_id: string;

  @ManyToOne(() => EventModel, (event) => event.venues)
  @JoinColumn({ name: 'event_id' })
  declare event: Relation<EventModel>;
}

@Entity('events_themes')
export class EventThemeModel {
  @PrimaryColumn('uuid')
  declare event_id: string;

  @PrimaryColumn('integer')
  declare number: number;

  @Column('uuid')
  declare theme_id: string;

  @ManyToOne(() => EventModel, (event) => event.themes)
  @JoinColumn({ name: 'event_id' })
  declare event: Relation<EventModel>;
}

@Entity('events_guests')
export class EventGuestModel {
  @PrimaryColumn('uuid')
  declare event_id: string;

  @PrimaryColumn('integer')
  declare number: number;

  @Column('uuid')
  declare user_id: string;

  @Column('uuid')
  declare rank_id: string;

  @ManyToOne(() => EventModel, (event) => event.guests)
  @JoinColumn({ name: 'event_id' })
  declare event: Relation<EventModel>;
}

@Entity('events_members')
export class EventMemberModel {
  @PrimaryColumn('uuid')
  declare event_id: string;

  @PrimaryColumn('integer')
  declare number: number;

  @Column('uuid')
  declare user_id: string;

  @Column('uuid')
  declare role_id: string;

  @ManyToOne(() => EventModel, (event) => event.team)
  @JoinColumn({ name: 'event_id' })
  declare event: Relation<EventModel>;
}

@Entity('events')
@Index(['deleted_at'])
@Index(['submitter_id'])
export class EventModel {
  @PrimaryColumn('uuid')
  declare id: string;

  @Column('uuid')
  declare form_id: string;

  @Column('varchar')
  declare slug: string;

  @Column('varchar')
  declare name: string;

  @Column('text')
  declare description: string;

  @Column('timestamptz')
  declare start: Date;

  @Column('timestamptz')
  declare end: Date;

  @Column('uuid')
  declare format_id: string;

  @Column('uuid')
  declare type_id: string;

  @Column('uuid')
  declare level_id: string;

  @Column('integer')
  declare participants_students: number;

  @Column('integer')
  declare participants_employees: number;

  @Column('integer')
  declare participants_others: number;

  @Column('uuid')
  declare signed_scan_id: string;

  @Column('uuid')
  declare submitter_id: string;

  @Column('uuid')
  declare reviewed_by: string;

  @Column('timestamptz')
  declare created_at: Date;

  @Column('timestamptz', { nullable: true })
  declare deleted_at: Date | null;

  @OneToMany(() => EventOrganizerModel, (organizer) => organizer.event, {
    cascade: true,
  })
  declare organizers: EventOrganizerModel[];

  @OneToMany(() => EventLinkModel, (link) => link.event, { cascade: true })
  declare links: EventLinkModel[];

  @OneToMany(() => EventVenueModel, (venue) => venue.event, { cascade: true })
  declare venues: EventVenueModel[];

  @OneToMany(() => EventThemeModel, (theme) => theme.event, { cascade: true })
  declare themes: EventThemeModel[];

  @OneToMany(() => EventGuestModel, (guest) => guest.event, { cascade: true })
  declare guests: EventGuestModel[];

  @OneToMany(() => EventMemberModel, (member) => member.event, {
    cascade: true,
  })
  declare team: EventMemberModel[];
}
