import { FormStatus } from './status.enum';
import { Guest, Member, Participants } from '../../shared/domain';
import { err, ok, Result } from 'neverthrow';
import { FormsError } from './errors';

import Instant = Temporal.Instant;
import Now = Temporal.Now;
import PlainDateTime = Temporal.PlainDateTime;

const FORM_STATUS_TRANSITIONS: Record<FormStatus, FormStatus[]> = {
  [FormStatus.Draft]: [FormStatus.Pending, FormStatus.Canceled],
  [FormStatus.Pending]: [
    FormStatus.Draft,
    FormStatus.Canceled,
    FormStatus.Reviewing,
  ],
  [FormStatus.Reviewing]: [
    FormStatus.Draft,
    FormStatus.Approved,
    FormStatus.Rejected,
  ],
  [FormStatus.Approved]: [],
  [FormStatus.Canceled]: [],
  [FormStatus.Rejected]: [],
};

export interface FormInit {
  id: string;
  name: string;
  description: string;
  organizers: string[];
  links: string[];
  venues: string[];
  themes: string[];
  start: PlainDateTime;
  end: PlainDateTime;
  formatId: string;
  typeId: string;
  levelId: string;
  participants: Participants;
  guests: Guest[];
  team: Member[];
  status: FormStatus;
  reason: string | null;
  submitterId: string;
  createdAt: Instant;
  updatedAt: Instant;
  reviewedAt: Instant | null;
  reviewerId: string | null;
  canceledAt: Instant | null;
  deletedAt: Instant | null;
}

export interface FormCreate {
  id: string;
  name: string;
  description: string;
  organizers: string[];
  links: string[];
  venues: string[];
  themes: string[];
  start: PlainDateTime;
  end: PlainDateTime;
  formatId: string;
  typeId: string;
  levelId: string;
  participants: Participants;
  guests: Guest[];
  team: Member[];
  submitterId: string;
}

export class Form {
  declare id: string;
  declare name: string;
  declare description: string;
  declare organizers: string[];
  declare links: string[];
  declare venues: string[];
  declare themes: string[];
  declare start: PlainDateTime;
  declare end: PlainDateTime;
  declare formatId: string;
  declare typeId: string;
  declare levelId: string;
  declare participants: Participants;
  declare guests: Guest[];
  declare team: Member[];
  declare status: FormStatus;
  declare reason: string | null;
  declare submitterId: string;
  declare createdAt: Instant;
  declare updatedAt: Instant;
  declare reviewedAt: Instant | null;
  declare reviewerId: string | null;
  declare canceledAt: Instant | null;
  declare deletedAt: Instant | null;

  private constructor(init: FormInit) {
    Object.assign(this, init);
  }

  static create(
    init: FormCreate,
    now: Instant = Now.instant(),
  ): Result<Form, FormsError> {
    if (PlainDateTime.compare(init.start, init.end) >= 0) {
      return err(FormsError.invariant('start must be before end'));
    }

    return ok(
      new Form({
        ...init,
        status: FormStatus.Draft,
        reason: null,
        createdAt: now,
        updatedAt: now,
        reviewedAt: null,
        reviewerId: null,
        canceledAt: null,
        deletedAt: null,
      }),
    );
  }

  static restore(init: FormInit): Result<Form, FormsError> {
    const v = Form.validate(init);
    if (v.isErr()) {
      return err(v.error);
    }
    return ok(new Form(init));
  }

  private static validate(init: FormInit): Result<void, FormsError> {
    if (PlainDateTime.compare(init.start, init.end) >= 0) {
      return err(FormsError.invariant('start must be before end'));
    }

    if (
      init.reason != null &&
      ![FormStatus.Draft, FormStatus.Rejected].includes(init.status)
    ) {
      return err(
        FormsError.invariant(
          'reason may be non-null only if form is draft or rejected',
        ),
      );
    }

    if (
      [FormStatus.Reviewing, FormStatus.Approved, FormStatus.Rejected].includes(
        init.status,
      ) !==
      (init.reviewerId != null)
    ) {
      return err(
        FormsError.invariant(
          `reviewerId may be non-null only if status is in ` +
            `["${FormStatus.Reviewing}", "${FormStatus.Approved}", "${FormStatus.Rejected}"]`,
        ),
      );
    }

    if (
      [FormStatus.Approved, FormStatus.Rejected].includes(init.status) !==
      (init.reviewedAt != null)
    ) {
      return err(
        FormsError.invariant(
          'reviewedAt may be non-null only if form is approved or rejected',
        ),
      );
    }

    if (init.status == FormStatus.Canceled && init.canceledAt == null) {
      return err(
        FormsError.invariant('canceled form must have non-null canceledAt'),
      );
    }

    return ok();
  }

  private transition(
    status: FormStatus,
    now: Instant = Now.instant(),
  ): Result<void, FormsError> {
    const allowed = FORM_STATUS_TRANSITIONS[this.status];
    if (!allowed.includes(status)) {
      return err(FormsError.invalidTransition(this.status, status));
    }
    this.status = status;
    this.updatedAt = now;
    return ok();
  }

  // Преобразовывает заявку в состояние черновика.
  //
  // Заявка в черновик может быть отправлена как самим заявителем (например,
  // если есть необходимость временно скрыть от модераторов заявку), так как и
  // модератором как один из возможных результатов модерации. В последнем
  // случае модератор прикрепляет текст причину отправки на доработку.
  public convertToDraft(
    reason: string | null = null,
    now: Instant = Now.instant(),
  ): Result<void, FormsError> {
    const t = this.transition(FormStatus.Draft, now);
    if (t.isErr()) {
      return t;
    }
    this.reason = reason;
    this.reviewerId = null; // Если модератор отправил на доработку, то он больше никак не связан с заявкой
    return ok();
  }

  // Преобразовывает заявку в состояние, готовое к модерации.
  public ready(now: Instant = Now.instant()): Result<void, FormsError> {
    const t = this.transition(FormStatus.Pending, now);
    if (t.isErr()) {
      return t;
    }
    this.reason = null;
    return ok();
  }

  // Преобразовывает заявку в состояние ревью.
  //
  // Указывается reviewerId - ID модератора, который взял её на модерацию.
  public startReview(
    reviewerId: string,
    now: Instant = Now.instant(),
  ): Result<void, FormsError> {
    const t = this.transition(FormStatus.Reviewing, now);
    if (t.isErr()) {
      return t;
    }
    this.reviewerId = reviewerId;
    return ok();
  }

  // Преобразовывает заявку в подтвержденное состояние.
  public approve(now: Instant = Now.instant()): Result<void, FormsError> {
    const t = this.transition(FormStatus.Approved, now);
    if (t.isErr()) {
      return t;
    }
    this.reviewedAt = now;
    return ok();
  }

  // Безвозвратно отменяет заявку модератором.
  public reject(
    reason: string | null,
    now: Instant = Now.instant(),
  ): Result<void, FormsError> {
    const t = this.transition(FormStatus.Rejected, now);
    if (t.isErr()) {
      return t;
    }
    this.reason = reason;
    this.reviewedAt = now;
    return ok();
  }

  // Отменяет заявку заявителем.
  public cancel(now: Instant = Now.instant()): Result<void, FormsError> {
    const t = this.transition(FormStatus.Canceled, now);
    if (t.isErr()) {
      return t;
    }
    this.canceledAt = now;
    return ok();
  }

  // Идемпотентная операция удаления сущности.
  public delete(now: Instant = Now.instant()) {
    this.deletedAt = now;
  }
}
