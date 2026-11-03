import { Inject, Injectable } from '@nestjs/common';
import { FormRepository } from '../../infra/repository/form.repository';
import { err, ok, Result, ResultAsync } from 'neverthrow';
import { FormEntity } from '../../domain/form.entity';
import { FormsError } from '../../domain/errors';
import { UUID_PORT, type UuidPort } from '../../../shared/infra/uuid/uuid.port';

import { Member } from '../../domain/member.entity';
import { Guest } from '../../domain/guest.entity';
import {
  AuthenticatedUser,
  UserRole,
} from '../../../shared/domain/authenticated-user.entity';
import { Participants } from '../../domain/participants.entity';
import { SLUG_PORT } from '../../../shared/infra/slug/slug.tokens';
import { SlugPort } from '../../../shared/infra/slug/slug.port';

export type CreateFormCommand = {
  actor: AuthenticatedUser;
  name: string;
  description: string;
  organizers: string[];
  links: string[];
  venues: string[];
  themes: string[];
  start: string;
  end: string;
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
};

@Injectable()
export class CreateFormHandler {
  constructor(
    private readonly repository: FormRepository,
    @Inject(UUID_PORT) private readonly uuid: UuidPort,
    @Inject(SLUG_PORT) private readonly slug: SlugPort,
  ) {}

  execute(cmd: CreateFormCommand): ResultAsync<FormEntity, FormsError> {
    return this.ensureCanCreateForm(cmd.actor)
      .andThen(() =>
        FormEntity.create({
          id: this.uuid.generate(),
          slug: this.slug.generate(),
          ...cmd,
          start: Temporal.PlainDateTime.from(cmd.start.replace(/Z$/, '')),
          end: Temporal.PlainDateTime.from(cmd.end.replace(/Z$/, '')),
          participants: new Participants(
            cmd.participants.students,
            cmd.participants.employees,
            cmd.participants.others,
          ),
          guests: cmd.guests.map((g) => new Guest(g.userId, g.rankId)),
          team: cmd.team.map((m) => new Member(m.userId, m.roleId)),
          submitterId: cmd.actor.id,
        }),
      )
      .asyncAndThen((form) => this.repository.save(form));
  }

  private ensureCanCreateForm(
    actor: AuthenticatedUser,
  ): Result<void, FormsError> {
    if (!actor.roles.includes(UserRole.Applicant)) {
      return err(
        FormsError.forbidden(`form can be created only by applicants`),
      );
    }
    return ok();
  }
}
