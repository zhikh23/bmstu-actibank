import { FormInit } from './form.entity';
import { FormStatus } from './status.enum';

export const now = Temporal.Instant.from('2026-01-01T00:00:00Z');
export const later = Temporal.Instant.from('2026-01-02T00:00:00Z');

export const start = Temporal.PlainDateTime.from('2026-06-01T10:00:00');
export const end = Temporal.PlainDateTime.from('2026-06-01T12:00:00');

export const baseInit = (overrides: Partial<FormInit> = {}): FormInit => ({
  id: 'form-1',
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
  participants: {
    students: 7,
    employees: 2,
    others: 0,
  },
  guests: [],
  team: [],
  status: FormStatus.Draft,
  reason: null,
  revision: 1,
  submitterId: 'user-1',
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
