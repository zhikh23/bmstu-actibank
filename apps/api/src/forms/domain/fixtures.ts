import { FormInit } from './form.entity';
import { FormStatus } from './status.enum';
import { FormDocumentEntity } from './form-document.entity';
import { Participants } from './participants.entity';

export const now = Temporal.Instant.from('2026-01-01T00:00:00Z');
export const later = Temporal.Instant.from('2026-01-02T00:00:00Z');

export const start = Temporal.PlainDateTime.from('2026-06-01T10:00:00');
export const end = Temporal.PlainDateTime.from('2026-06-01T12:00:00');

export const baseInit = (overrides: Partial<FormInit> = {}): FormInit => ({
  id: 'form-1',
  slug: '123ABC',
  name: 'Test form',
  description: 'desc',
  organizers: ['org-1'],
  links: [],
  venues: [],
  themes: [],
  start,
  end,
  formatId: 'format-1',
  typeId: 'type-1',
  levelId: 'level-1',
  participants: new Participants(7, 2, 0),
  guests: [],
  team: [],
  status: FormStatus.Draft,
  reason: null,
  submitterId: 'user-1',
  document: FormDocumentEntity.restore({
    id: 'form-doc-1',
    generatedId: 'gen-1',
    scanId: 'scan-1',
    createdAt: now,
    uploadedAt: null,
  })._unsafeUnwrap(),
  createdAt: now,
  updatedAt: now,
  reviewedAt: null,
  reviewerId: null,
  canceledAt: null,
  deletedAt: null,
  ...overrides,
});

const STATUS_DEFAULTS: Record<FormStatus, Partial<FormInit>> = {
  [FormStatus.Draft]: {},
  [FormStatus.Pending]: {},
  [FormStatus.Canceled]: {
    canceledAt: later,
  },
  [FormStatus.Reviewing]: {
    reviewerId: 'mod-1',
  },
  [FormStatus.Approved]: {
    reviewerId: 'mod-1',
    reviewedAt: later,
  },
  [FormStatus.Rejected]: {
    reason: 'some reason',
    reviewerId: 'mod-1',
    reviewedAt: later,
  },
};

export const validInit = (
  status: FormStatus,
  overrides: Partial<FormInit> = {},
): FormInit => baseInit({ ...STATUS_DEFAULTS[status], status, ...overrides });
