import { EventEntity } from '@/events/domain/event.entity';
import {
  EventGuestModel,
  EventLinkModel,
  EventMemberModel,
  EventModel,
  EventOrganizerModel,
  EventThemeModel,
  EventVenueModel,
} from './event.model';
import {
  dateToInstant,
  dateToPlainDateTime,
  instantToDate,
  plainDateTimeToDate,
} from '@/shared/utils/dates';
import { Result } from 'neverthrow';
import { Participants } from '@/shared/domain/participants.entity';
import { EventsError } from '@/events/domain/events.error';

export const EventMapper = {
  toModel(e: EventEntity): EventModel {
    const m = new EventModel();
    m.id = e.id;
    m.form_id = e.formId;
    m.slug = e.slug;
    m.name = e.name;
    m.description = e.description;
    m.start = plainDateTimeToDate(e.start);
    m.end = plainDateTimeToDate(e.end);
    m.format_id = e.formatId;
    m.type_id = e.typeId;
    m.level_id = e.levelId;
    m.participants_students = e.participants.students;
    m.participants_employees = e.participants.employees;
    m.participants_others = e.participants.others;
    m.signed_scan_id = e.signedScanId;
    m.submitter_id = e.submitterId;
    m.reviewed_by = e.reviewedBy;
    m.created_at = instantToDate(e.createdAt);
    m.deleted_at = e.deletedAt ? instantToDate(e.deletedAt) : null;
    m.organizers = e.organizers.map((organizer_id, number) =>
      Object.assign(new EventOrganizerModel(), {
        event_id: e.id,
        number,
        organizer_id,
        event: m,
      }),
    );
    m.links = e.links.map((link, number) =>
      Object.assign(new EventLinkModel(), {
        event_id: e.id,
        number,
        link,
        event: m,
      }),
    );
    m.venues = e.venues.map((venue_id, number) =>
      Object.assign(new EventVenueModel(), {
        event_id: e.id,
        number,
        venue_id,
        event: m,
      }),
    );
    m.themes = e.themes.map((theme_id, number) =>
      Object.assign(new EventThemeModel(), {
        event_id: e.id,
        number,
        theme_id,
        event: m,
      }),
    );
    m.team = e.team.map((member, number) =>
      Object.assign(new EventMemberModel(), {
        event_id: e.id,
        number,
        user_id: member.userId,
        role_id: member.roleId,
        event: m,
      }),
    );
    m.guests = e.guests.map((guest, number) =>
      Object.assign(new EventGuestModel(), {
        event_id: e.id,
        number,
        user_id: guest.userId,
        rank_id: guest.rankId,
        event: m,
      }),
    );
    return m;
  },

  toDomain(m: EventModel): Result<EventEntity, EventsError> {
    return EventEntity.restore({
      id: m.id,
      formId: m.form_id,
      slug: m.slug,
      name: m.name,
      description: m.description,
      organizers: m.organizers.map((o) => o.organizer_id),
      links: m.links.map((l) => l.link),
      venues: m.venues.map((v) => v.venue_id),
      themes: m.themes.map((t) => t.theme_id),
      start: dateToPlainDateTime(m.start),
      end: dateToPlainDateTime(m.end),
      formatId: m.format_id,
      typeId: m.type_id,
      levelId: m.level_id,
      participants: new Participants(
        m.participants_students,
        m.participants_employees,
        m.participants_others,
      ),
      guests: m.guests.map((g) => ({
        userId: g.user_id,
        rankId: g.rank_id,
      })),
      team: m.team.map((member) => ({
        userId: member.user_id,
        roleId: member.role_id,
      })),
      signedScanId: m.signed_scan_id,
      submitterId: m.submitter_id,
      reviewedBy: m.reviewed_by,
      createdAt: dateToInstant(m.created_at),
      deletedAt: m.deleted_at ? dateToInstant(m.deleted_at) : null,
    });
  },
};
