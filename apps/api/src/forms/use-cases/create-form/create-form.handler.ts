import { Inject, Injectable } from '@nestjs/common';
import { FormRepository } from '../../infra/repository/form.repository';
import { err, ok, Result } from 'neverthrow';
import { FormEntity } from '../../domain/form.entity';
import { FormsError } from '../../domain/errors';
import { UUID_PORT, type UuidPort } from '../../../shared/infra/uuid/uuid.port';
import { ParticipantsType } from '../../../shared/types/participants.type';
import { GuestType } from '../../../shared/types/guest.type';
import { MemberType } from '../../../shared/types/member.type';

import PlainDateTime = Temporal.PlainDateTime;
import { Member } from '../../domain/member.entity';
import { Guest } from '../../domain/guest.entity';
import {
  AuthenticatedUser,
  UserRole,
} from '../../../shared/domain/authenticated-user.entity';

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
  participants: ParticipantsType;
  guests: GuestType[];
  team: MemberType[];
};

@Injectable()
export class CreateFormHandler {
  constructor(
    private readonly formRepository: FormRepository,
    @Inject(UUID_PORT) private readonly uuid: UuidPort,
  ) {}

  async execute(
    cmd: CreateFormCommand,
  ): Promise<Result<FormEntity, FormsError>> {
    if (cmd.actor.roles.includes(UserRole.Applicant))
      return err(
        FormsError.forbidden(`form can be created only by applicants`),
      );

    const id = this.uuid.generate();
    const formResult = FormEntity.create({
      id: id,
      name: cmd.name,
      description: cmd.description,
      organizers: cmd.organizers,
      links: cmd.links,
      venues: cmd.venues,
      themes: cmd.themes,
      start: PlainDateTime.from(cmd.start),
      end: PlainDateTime.from(cmd.end),
      formatId: cmd.formatId,
      typeId: cmd.typeId,
      levelId: cmd.levelId,
      participants: cmd.participants,
      guests: cmd.guests.map((g) => new Guest(g.userId, g.rankId)),
      team: cmd.team.map((m) => new Member(m.userId, m.roleId)),
      submitterId: cmd.actor.id,
    });
    if (formResult.isErr()) {
      return err(formResult.error);
    }
    const form = formResult.value;

    const saveResult = await this.formRepository.save(form);
    if (saveResult.isErr()) {
      return err(saveResult.error);
    }
    return ok(form);
  }
}
