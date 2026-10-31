import { FormEntity } from './form.entity';
import { FormStatus } from './status.enum';
import {
  expectInvalidTransitionError,
  expectInvariantError,
  expectOk,
} from './asserts';
import { baseInit, later, now, start, validInit } from './fixtures';

const MSG = {
  startBeforeEnd: 'start must be before end',
  reasonOnlyDraftOrRejected:
    'reason may be non-null only if form is draft or rejected',
  reviewerOnlyForReviewStates:
    'reviewerId may be non-null only if status is in',
  reviewedAtOnlyForCompletedStates:
    'reviewedAt may be non-null only if form is approved or rejected',
  canceledAtMustBeNotNull: 'canceled form must have non-null canceledAt',
} as const;

describe('Form.restore', () => {
  describe('successfully restored', () => {
    it('returns ok for valid draft form', () => {
      const res = FormEntity.restore(baseInit());
      const form = expectOk(res);
      expect(form.id).toBe('form-1');
      expect(form.status).toBe(FormStatus.Draft);
      expect(form.reason).toBeNull();
      expect(form.reviewerId).toBeNull();
      expect(form.reviewedAt).toBeNull();
      expect(form.canceledAt).toBeNull();
    });

    it('returns ok for approved form with non-null reviewerId and reviewedAt', () => {
      const res = FormEntity.restore(
        baseInit({
          status: FormStatus.Approved,
          reviewerId: 'user-2',
          reviewedAt: now,
        }),
      );
      const form = expectOk(res);
      expect(form.status).toBe(FormStatus.Approved);
      expect(form.reviewerId).toBe('user-2');
      expect(form.reviewedAt).toBe(now);
    });

    it('returns ok for rejected form with non-null reviewerId, reviewedAt, and reason', () => {
      const res = FormEntity.restore(
        baseInit({
          status: FormStatus.Rejected,
          reviewerId: 'user-2',
          reviewedAt: now,
          reason: 'Some reason',
        }),
      );
      const form = expectOk(res);
      expect(form.status).toBe(FormStatus.Rejected);
      expect(form.reviewerId).toBe('user-2');
      expect(form.reviewedAt).toBe(now);
      expect(form.reason).toBe('Some reason');
    });

    it('returns ok for drafted form with non-null reason', () => {
      const res = FormEntity.restore(
        baseInit({
          status: FormStatus.Draft,
          reason: 'Some reason',
        }),
      );
      const form = expectOk(res);
      expect(form.status).toBe(FormStatus.Draft);
      expect(form.reason).toBe('Some reason');
    });

    it('returns deleted form with non-null deletedAt', () => {
      const res = FormEntity.restore(
        baseInit({
          deletedAt: now,
        }),
      );
      const form = expectOk(res);
      expect(form.deletedAt).toBe(now);
    });

    it('returns ok when canceled form has non-null canceledAt', () => {
      const res = FormEntity.restore(
        baseInit({
          status: FormStatus.Canceled,
          canceledAt: later,
        }),
      );
      const form = expectOk(res);
      expect(form.status).toBe(FormStatus.Canceled);
      expect(form.canceledAt).toBe(later);
    });
  });

  describe('start date must be before end date', () => {
    it('returns error for start date after end date', () => {
      const res = FormEntity.restore(
        baseInit({
          start: Temporal.PlainDateTime.from('2026-06-01T13:00:00'),
          end: Temporal.PlainDateTime.from('2026-06-01T12:00:00'),
        }),
      );
      expectInvariantError(res, MSG.startBeforeEnd);
    });

    it('returns error if start date is equal end date', () => {
      const res = FormEntity.restore(
        baseInit({
          end: start,
        }),
      );
      expectInvariantError(res, MSG.startBeforeEnd);
    });
  });

  describe('form must not contain non-null reason', () => {
    it.each([FormStatus.Reviewing, FormStatus.Approved, FormStatus.Pending])(
      'returns error when form status is %s',
      (status) => {
        const res = FormEntity.restore(
          baseInit({
            status: status,
            reason: 'sth',
          }),
        );
        expectInvariantError(res, MSG.reasonOnlyDraftOrRejected);
      },
    );
  });

  describe('form must not have reviewer', () => {
    it.each([FormStatus.Draft, FormStatus.Pending, FormStatus.Canceled])(
      'returns error when form status is %s',
      (status) => {
        const res = FormEntity.restore(
          baseInit({
            status: status,
            reviewerId: 'mod-1',
          }),
        );
        expectInvariantError(res, MSG.reviewerOnlyForReviewStates);
      },
    );
  });

  describe('form must not have reviewedAt', () => {
    it.each([FormStatus.Draft, FormStatus.Pending, FormStatus.Canceled])(
      'returns error when form status is %s',
      (status) => {
        const res = FormEntity.restore(
          baseInit({
            status: status,
            reviewedAt: later,
          }),
        );
        expectInvariantError(res, MSG.reviewedAtOnlyForCompletedStates);
      },
    );

    it('returns error when form status is reviewing', () => {
      const res = FormEntity.restore(
        baseInit({
          status: FormStatus.Reviewing,
          reviewerId: 'mod-1',
          reviewedAt: later,
        }),
      );
      expectInvariantError(res, MSG.reviewedAtOnlyForCompletedStates);
    });
  });

  describe('canceled form must have null canceledAt', () => {
    const res = FormEntity.restore(
      baseInit({
        status: FormStatus.Canceled,
      }),
    );
    expectInvariantError(res, MSG.canceledAtMustBeNotNull);
  });
});

describe('Form.convertToDraft', () => {
  describe('successfully converted to draft', () => {
    it.each([FormStatus.Pending, FormStatus.Reviewing])(
      'return ok when form status is %s',
      (status) => {
        const form = expectOk(FormEntity.restore(validInit(status)));
        expectOk(form.convertToDraft());
        expect(form.status).toBe(FormStatus.Draft);
      },
    );
  });

  describe('must not be converted to draft', () => {
    it.each([
      FormStatus.Draft,
      FormStatus.Rejected,
      FormStatus.Approved,
      FormStatus.Canceled,
    ])('return error when form status is %s', (status) => {
      const form = expectOk(FormEntity.restore(validInit(status)));
      expectInvalidTransitionError(form.convertToDraft());
    });
  });
});

describe('Form.ready', () => {
  describe('successfully marked as pending', () => {
    it('return ok when form is draft', () => {
      const form = expectOk(FormEntity.restore(validInit(FormStatus.Draft)));
      expectOk(form.markReady());
      expect(form.status).toBe(FormStatus.Pending);
    });
  });

  describe('must not be converted to pending', () => {
    it.each([
      FormStatus.Pending,
      FormStatus.Reviewing,
      FormStatus.Approved,
      FormStatus.Rejected,
      FormStatus.Canceled,
    ])('return error when form status is %s', (status) => {
      const form = expectOk(FormEntity.restore(validInit(status)));
      expectInvalidTransitionError(form.markReady());
    });
  });
});

describe('Form.review', () => {
  describe('successfully started form review', () => {
    it('return ok when form is pending', () => {
      const form = expectOk(FormEntity.restore(validInit(FormStatus.Pending)));
      expectOk(form.startReview('mod-1'));
      expect(form.status).toBe(FormStatus.Reviewing);
      expect(form.reviewerId).toBe('mod-1');
    });
  });

  describe('must not start review', () => {
    it.each([
      FormStatus.Draft,
      FormStatus.Reviewing,
      FormStatus.Approved,
      FormStatus.Rejected,
      FormStatus.Canceled,
    ])('return error when form status is %s', (status) => {
      const form = expectOk(FormEntity.restore(validInit(status)));
      expectInvalidTransitionError(form.startReview('mod-1'));
    });
  });
});

describe('Form.approve', () => {
  describe('successfully approved form', () => {
    it('return ok when form is reviewing', () => {
      const form = expectOk(
        FormEntity.restore(validInit(FormStatus.Reviewing)),
      );
      expectOk(form.approve(later));
      expect(form.status).toBe(FormStatus.Approved);
      expect(form.reviewedAt).toBe(later);
    });
  });

  describe('must not be approved', () => {
    it.each([
      FormStatus.Draft,
      FormStatus.Pending,
      FormStatus.Approved,
      FormStatus.Rejected,
      FormStatus.Canceled,
    ])('return error when form status is %s', (status) => {
      const form = expectOk(FormEntity.restore(validInit(status)));
      expectInvalidTransitionError(form.approve());
    });
  });
});

describe('Form.reject', () => {
  describe('successfully rejected form', () => {
    it('return ok when form is reviewing', () => {
      const form = expectOk(
        FormEntity.restore(validInit(FormStatus.Reviewing)),
      );
      expectOk(form.reject('some reason', later));
      expect(form.status).toBe(FormStatus.Rejected);
      expect(form.reviewedAt).toBe(later);
      expect(form.reason).toBe('some reason');
    });
  });

  describe('must not be rejected', () => {
    it.each([
      FormStatus.Draft,
      FormStatus.Pending,
      FormStatus.Approved,
      FormStatus.Rejected,
      FormStatus.Canceled,
    ])('return error when form status is %s', (status) => {
      const form = expectOk(FormEntity.restore(validInit(status)));
      expectInvalidTransitionError(form.reject('some reason'));
    });
  });
});

describe('Form.cancel', () => {
  describe('successfully canceled form', () => {
    it.each([FormStatus.Draft, FormStatus.Pending])(
      'return ok when status is %s',
      (status) => {
        const form = expectOk(FormEntity.restore(validInit(status)));
        expectOk(form.cancel(later));
        expect(form.status).toBe(FormStatus.Canceled);
      },
    );
  });

  describe('must not be rejected', () => {
    it.each([
      FormStatus.Draft,
      FormStatus.Pending,
      FormStatus.Approved,
      FormStatus.Rejected,
      FormStatus.Canceled,
    ])('return error when form status is %s', (status) => {
      const form = expectOk(FormEntity.restore(validInit(status)));
      expectInvalidTransitionError(form.reject('some reason'));
    });
  });
});

describe('Form.delete', () => {
  describe('successfully deleted form', () => {
    it('deletedAt is set', () => {
      const form = expectOk(FormEntity.restore(baseInit()));
      form.delete(later);
      expect(form.deletedAt).toBe(later);
    });
  });
});
