import { Inject, Injectable } from '@nestjs/common';
import { FormRepository } from '../../infra/repository/form.repository';
import { Temporal } from '@js-temporal/polyfill';
import PlainDateTime = Temporal.PlainDateTime;
import { err, ok, Result } from 'neverthrow';
import { Form } from '../../domain/form.entity';
import { FormsError } from '../../domain/errors';
import { UUID_PORT, type UuidPort } from '../../../shared/infra/uuid/uuid.port';
import { Guest, Member } from '../../../shared/domain';
import { ParticipantsType } from '../../../shared/types/participants.type';
import { GuestType } from '../../../shared/types/guest.type';
import { MemberType } from '../../../shared/types/member.type';

export type CreateFormCommand = {
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
  submitterId: string;
};

@Injectable()
export class CreateFormHandler {
  constructor(
    private readonly formRepository: FormRepository,
    @Inject(UUID_PORT) private readonly uuid: UuidPort,
  ) {}

  async execute(cmd: CreateFormCommand): Promise<Result<Form, FormsError>> {
    const id = this.uuid.generate();
    const formResult = Form.create({
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
      submitterId: cmd.submitterId,
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
