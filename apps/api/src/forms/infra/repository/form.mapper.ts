import { Result, err } from 'neverthrow';

import { FormsError } from '@/forms/domain/errors';
import { FormDocumentEntity } from '@/forms/domain/form-document.entity';
import { FormEntity } from '@/forms/domain/form.entity';
import { Guest } from '@/forms/domain/guest.entity';
import { Member } from '@/forms/domain/member.entity';
import { Participants } from '@/forms/domain/participants.entity';
import {
  dateToInstant,
  dateToPlainDateTime,
  instantToDate,
  plainDateTimeToDate,
} from '@/shared/utils/dates';

import { FormDocumentMapper } from './form-document.mapper';
import {
  FormGuest,
  FormLink,
  FormMember,
  FormModel,
  FormOrganizer,
  FormTheme,
  FormVenue,
} from './form.model';

export class FormMapper {
  static toModel(f: FormEntity): FormModel {
    const m = new FormModel();
    m.id = f.id;
    m.slug = f.slug;
    m.name = f.name;
    m.description = f.description;
    m.start = plainDateTimeToDate(f.start);
    m.end = plainDateTimeToDate(f.end);
    m.format_id = f.formatId;
    m.type_id = f.typeId;
    m.level_id = f.levelId;
    m.participants_students = f.participants.students;
    m.participants_employees = f.participants.employees;
    m.participants_others = f.participants.others;
    m.status = f.status;
    m.reason = f.reason;
    m.submitter_id = f.submitterId;
    m.reviewer_id = f.reviewerId;
    m.document = f.document
      ? FormDocumentMapper.toModel(f.document, f.id)
      : null;
    m.created_at = instantToDate(f.createdAt);
    m.updated_at = instantToDate(f.updatedAt);
    m.reviewed_at = f.reviewedAt ? instantToDate(f.reviewedAt) : null;
    m.canceled_at = f.canceledAt ? instantToDate(f.canceledAt) : null;
    m.deleted_at = f.deletedAt ? instantToDate(f.deletedAt) : null;
    m.organizers = f.organizers.map((organizer_id, number) =>
      Object.assign(new FormOrganizer(), {
        form_id: f.id,
        number,
        organizer_id,
        form: m,
      }),
    );
    m.links = f.links.map((link, number) =>
      Object.assign(new FormLink(), {
        form_id: f.id,
        number,
        link,
        form: m,
      }),
    );
    m.venues = f.venues.map((venue_id, number) =>
      Object.assign(new FormVenue(), {
        form_id: f.id,
        number,
        venue_id,
        form: m,
      }),
    );
    m.themes = f.themes.map((theme_id, number) =>
      Object.assign(new FormTheme(), {
        form_id: f.id,
        number,
        theme_id,
        form: m,
      }),
    );
    m.guests = f.guests.map((guest, number) =>
      Object.assign(new FormGuest(), {
        form_id: f.id,
        number,
        user_id: guest.userId,
        rank_id: guest.rankId,
        form: m,
      }),
    );
    m.team = f.team.map((member, number) =>
      Object.assign(new FormMember(), {
        form_id: f.id,
        number,
        user_id: member.userId,
        role_id: member.roleId,
        form: m,
      }),
    );
    return m;
  }

  static toDomain(m: FormModel): Result<FormEntity, FormsError> {
    let document: FormDocumentEntity | null = null;
    if (m.document) {
      const res = FormDocumentMapper.toDomain(m.document);
      if (res.isErr()) return err(res.error);
      document = res.value;
    }
    return FormEntity.restore({
      canceledAt: m.canceled_at ? dateToInstant(m.canceled_at) : null,
      createdAt: dateToInstant(m.created_at),
      deletedAt: m.deleted_at ? dateToInstant(m.deleted_at) : null,
      description: m.description,
      document,
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
      slug: m.slug,
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
