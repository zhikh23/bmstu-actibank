import { Form } from '../../domain/form.entity';
import {
  FormGuest,
  FormLink,
  FormMember,
  FormModel,
  FormOrganizer,
  FormTheme,
  FormVenue,
} from './form.model';
import {
  dateToInstant,
  dateToPlainDateTime,
  instantToDate,
  plainDateTimeToDate,
} from '../../../shared/utils/dates';
import { Result } from 'neverthrow';
import { FormsError } from '../../domain/errors';
import { Guest } from '../../domain/guest.entity';
import { Participants } from '../../domain/participants.entity';
import { Member } from '../../domain/member.entity';

export class FormMapper {
  static toModel(f: Form): FormModel {
    const model = new FormModel();
    model.id = f.id;
    model.name = f.name;
    model.description = f.description;
    model.start = plainDateTimeToDate(f.start);
    model.end = plainDateTimeToDate(f.end);
    model.format_id = f.formatId;
    model.type_id = f.typeId;
    model.level_id = f.levelId;
    model.participants_students = f.participants.students;
    model.participants_employees = f.participants.employees;
    model.participants_others = f.participants.others;
    model.status = f.status;
    model.reason = f.reason;
    model.submitter_id = f.submitterId;
    model.reviewer_id = f.reviewerId;
    model.created_at = instantToDate(f.createdAt);
    model.updated_at = instantToDate(f.updatedAt);
    model.reviewed_at = f.reviewedAt ? instantToDate(f.reviewedAt) : null;
    model.canceled_at = f.canceledAt ? instantToDate(f.canceledAt) : null;
    model.deleted_at = f.deletedAt ? instantToDate(f.deletedAt) : null;
    model.organizers = f.organizers.map((organizer, number) =>
      Object.assign(new FormOrganizer(), {
        form_id: f.id,
        number,
        organizer,
        form: model,
      }),
    );
    model.links = f.links.map((link, number) =>
      Object.assign(new FormLink(), {
        form_id: f.id,
        number,
        link,
        form: model,
      }),
    );
    model.venues = f.venues.map((venue_id, number) =>
      Object.assign(new FormVenue(), {
        form_id: f.id,
        number,
        venue_id,
        form: model,
      }),
    );
    model.themes = f.themes.map((theme_id, number) =>
      Object.assign(new FormTheme(), {
        form_id: f.id,
        number,
        theme_id,
        form: model,
      }),
    );
    model.guests = f.guests.map((guest, number) =>
      Object.assign(new FormGuest(), {
        form_id: f.id,
        number,
        user_id: guest.userId,
        rank_id: guest.rankId,
        form: model,
      }),
    );
    model.team = f.team.map((member, number) =>
      Object.assign(new FormMember(), {
        form_id: f.id,
        number,
        user_id: member.userID,
        role_id: member.roleID,
        form: model,
      }),
    );
    return model;
  }

  static toDomain(m: FormModel): Result<Form, FormsError> {
    return Form.restore({
      canceledAt: m.canceled_at ? dateToInstant(m.canceled_at) : null,
      createdAt: dateToInstant(m.created_at),
      deletedAt: m.deleted_at ? dateToInstant(m.deleted_at) : null,
      description: m.description,
      end: dateToPlainDateTime(m.end),
      formatId: m.format_id,
      guests: m.guests.map((g) => new Guest(g.user_id, g.rank_id)),
      id: m.id,
      levelId: m.level_id,
      links: m.links.map((l) => l.link),
      name: m.name,
      organizers: m.organizers.map((o) => o.organizer_id),
      participants: new Participants(
        m.participants_students,
        m.participants_employees,
        m.participants_others,
      ),
      reason: m.reason,
      reviewedAt: m.reviewed_at ? dateToInstant(m.reviewed_at) : null,
      reviewerId: m.reviewer_id,
      start: dateToPlainDateTime(m.start),
      status: m.status,
      submitterId: m.submitter_id,
      team: m.team.map((m) => new Member(m.user_id, m.role_id)),
      themes: m.themes.map((t) => t.theme_id),
      typeId: m.type_id,
      updatedAt: dateToInstant(m.updated_at),
      venues: m.venues.map((v) => v.venue_id),
    });
  }
}
