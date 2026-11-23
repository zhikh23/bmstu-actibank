import { Inject, Injectable } from '@nestjs/common';
import { EventRepository } from '@/events/infra/repository/event.repository';
import { UUID_PORT, type UuidPort } from '@/shared/infra/uuid/uuid.port';
import { ResultAsync } from 'neverthrow';
import { EventsError } from '@/events/domain/events.error';
import { EventEntity } from '@/events/domain/event.entity';
import { Participants } from '@/shared/domain/participants.entity';
import { Guest } from '@/shared/domain/guest.entity';
import { Member } from '@/shared/domain/member.entity';
import { dateToPlainDateTime } from '@/shared/utils/dates';

export interface CreateEventCommand {
  slug: string;
  formId: string;
  name: string;
  description: string;
  organizers: string[];
  links: string[];
  venues: string[];
  themes: string[];
  start: Date;
  end: Date;
  formatId: string;
  typeId: string;
  levelId: string;
  participants: {
    students: number;
    employees: number;
    others: number;
  };
  guests: {
    userId: string;
    rankId: string;
  }[];
  team: {
    userId: string;
    roleId: string;
  }[];
  signedScanId: string;
  submitterId: string;
  reviewedBy: string;
}

@Injectable()
export class CreateEventHandler {
  constructor(
    private readonly repository: EventRepository,
    @Inject(UUID_PORT) private readonly uuid: UuidPort,
  ) {}

  execute(cmd: CreateEventCommand): ResultAsync<string, EventsError> {
    return EventEntity.create({
      id: this.uuid.generate(),
      ...cmd,
      start: dateToPlainDateTime(cmd.start),
      end: dateToPlainDateTime(cmd.end),
      participants: new Participants(
        cmd.participants.students,
        cmd.participants.employees,
        cmd.participants.others,
      ),
      guests: cmd.guests.map((g) => new Guest(g.userId, g.rankId)),
      team: cmd.team.map((m) => new Member(m.userId, m.roleId)),
    })
      .asyncAndThen((event) => this.repository.save(event))
      .map((event) => event.id);
  }
}
