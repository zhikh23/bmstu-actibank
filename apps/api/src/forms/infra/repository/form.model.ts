import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { FormStatus } from '../../domain/status.enum';

@Entity('forms_organizers')
export class FormOrganizer {
  @PrimaryColumn('uuid')
  declare form_id: string;

  @PrimaryColumn('integer')
  declare number: number;

  @Column('uuid')
  declare organizer_id: string;

  @ManyToOne(() => FormModel, (form) => form.organizers)
  @JoinColumn({ name: 'form_id' })
  declare form: Relation<FormModel>;
}

@Entity('forms_links')
export class FormLink {
  @PrimaryColumn('uuid')
  declare form_id: string;

  @PrimaryColumn('integer')
  declare number: number;

  @Column('varchar')
  declare link: string;

  @ManyToOne(() => FormModel, (form) => form.links)
  @JoinColumn({ name: 'form_id' })
  declare form: Relation<FormModel>;
}

@Entity('forms_venues')
export class FormVenue {
  @PrimaryColumn('uuid')
  declare form_id: string;

  @PrimaryColumn('integer')
  declare number: number;

  @Column('varchar')
  declare venue_id: string;

  @ManyToOne(() => FormModel, (form) => form.venues)
  @JoinColumn({ name: 'form_id' })
  declare form: Relation<FormModel>;
}

@Entity('forms_themes')
export class FormTheme {
  @PrimaryColumn('uuid')
  declare form_id: string;

  @PrimaryColumn('integer')
  declare number: number;

  @Column('varchar')
  declare theme_id: string;

  @ManyToOne(() => FormModel, (form) => form.themes)
  @JoinColumn({ name: 'form_id' })
  declare form: Relation<FormModel>;
}

@Entity('forms_guests')
export class FormGuest {
  @PrimaryColumn('uuid')
  declare form_id: string;

  @PrimaryColumn('integer')
  declare number: number;

  @Column('uuid')
  declare user_id: string;

  @Column('uuid')
  declare rank_id: string;

  @ManyToOne(() => FormModel, (form) => form.guests)
  @JoinColumn({ name: 'form_id' })
  declare form: Relation<FormModel>;
}

@Entity('forms_members')
export class FormMember {
  @PrimaryColumn('uuid')
  declare form_id: string;

  @PrimaryColumn('integer')
  declare number: number;

  @Column('uuid')
  declare user_id: string;

  @Column('uuid')
  declare role_id: string;

  @ManyToOne(() => FormModel, (form) => form.team)
  @JoinColumn({ name: 'form_id' })
  declare form: Relation<FormModel>;
}

@Entity('forms_documents')
@Index(['form_id'])
export class FormDocumentModel {
  @PrimaryColumn('uuid')
  declare id: string;

  @Column('uuid')
  declare form_id: string;

  @Column('uuid')
  declare generated_id: string;

  @Column('uuid', { nullable: true })
  declare scan_id: string | null;

  @Column('timestamptz')
  declare created_at: Date;

  @Column('timestamptz', { nullable: true })
  declare uploaded_at: Date | null;

  @ManyToOne(() => FormModel, (form) => form.documents)
  @JoinColumn({ name: 'form_id' })
  declare form: Relation<FormModel>;
}

@Entity('forms')
@Index(['deleted_at'])
@Index(['submitter_id'])
@Index(['status'])
export class FormModel {
  @PrimaryColumn('uuid')
  declare id: string;

  @Column('varchar')
  declare slug: string;

  @Column('varchar')
  declare name: string;

  @Column('text')
  declare description: string;

  @Column({ type: 'timestamptz' })
  declare start: Date;

  @Column({ type: 'timestamptz' })
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

  @Column({ type: 'varchar' })
  declare status: FormStatus;

  @Column({ type: 'text', nullable: true })
  declare reason: string | null;

  @Column({ type: 'uuid' })
  declare submitter_id: string;

  @Column('uuid', { nullable: true })
  declare document_id: string | null;

  @Column({ type: 'uuid', nullable: true })
  declare reviewer_id: string | null;

  @Column('timestamptz')
  declare created_at: Date;

  @Column('timestamptz')
  declare updated_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  declare reviewed_at: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  declare canceled_at: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  declare deleted_at: Date | null;

  @OneToMany(() => FormOrganizer, (organizer) => organizer.form, {
    cascade: true,
  })
  declare organizers: FormOrganizer[];

  @OneToMany(() => FormLink, (link) => link.form, { cascade: true })
  declare links: FormLink[];

  @OneToMany(() => FormVenue, (venue) => venue.form, { cascade: true })
  declare venues: FormVenue[];

  @OneToMany(() => FormTheme, (theme) => theme.form, { cascade: true })
  declare themes: FormTheme[];

  @OneToMany(() => FormGuest, (guest) => guest.form, { cascade: true })
  declare guests: FormGuest[];

  @OneToMany(() => FormMember, (member) => member.form, { cascade: true })
  declare team: FormMember[];

  // Последний приложенный и актуальный документ.
  @OneToOne(() => FormDocumentModel, { nullable: true, cascade: true })
  @JoinColumn({ name: 'document_id' })
  declare document: FormDocumentModel | null;

  @OneToMany(() => FormDocumentModel, (document) => document.form, {
    cascade: true,
  })
  declare documents: FormDocumentModel[];
}
