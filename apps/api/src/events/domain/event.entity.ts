import { Participants } from '@/shared/domain/participants.entity';
import { Guest } from '@/shared/domain/guest.entity';
import { Member } from '@/shared/domain/member.entity';
import { ok, Result } from 'neverthrow';
import { EventsError } from '@/events/domain/events.error';

export type EventCreate = {
  id: string;
  formId: string;
  slug: string;
  name: string;
  description: string;
  organizers: string[];
  links: string[];
  venues: string[];
  themes: string[];
  start: Temporal.PlainDateTime;
  end: Temporal.PlainDateTime;
  formatId: string;
  typeId: string;
  levelId: string;
  participants: Participants;
  guests: Guest[];
  team: Member[];
  signedScanId: string;
  submitterId: string;
  reviewedBy: string;
};

export type EventInit = EventCreate & {
  createdAt: Temporal.Instant;
  deletedAt: Temporal.Instant | null;
};

export class EventEntity {
  declare id: string;
  declare formId: string;
  declare slug: string;
  declare name: string;
  declare description: string;
  declare organizers: string[];
  declare links: string[];
  declare venues: string[];
  declare themes: string[];
  declare start: Temporal.PlainDateTime;
  declare end: Temporal.PlainDateTime;
  declare formatId: string;
  declare typeId: string;
  declare levelId: string;
  declare participants: Participants;
  declare guests: Guest[];
  declare team: Member[];
  declare signedScanId: string;
  declare submitterId: string;
  declare reviewedBy: string;
  declare createdAt: Temporal.Instant;
  declare deletedAt: Temporal.Instant | null;

  private constructor(init: EventInit) {
    Object.assign(this, init);
  }

  static create(
    data: EventCreate,
    now: Temporal.Instant = Temporal.Now.instant(),
  ): Result<EventEntity, EventsError> {
    return ok(new EventEntity({ ...data, createdAt: now, deletedAt: null }));
  }

  static restore(init: EventInit): Result<EventEntity, EventsError> {
    return ok(new EventEntity(init));
  }

  isTeamMember(userId: string): boolean {
    return this.team.some((member) => member.userId === userId);
  }

  delete(now: Temporal.Instant = Temporal.Now.instant()) {
    this.deletedAt = now;
  }
}
