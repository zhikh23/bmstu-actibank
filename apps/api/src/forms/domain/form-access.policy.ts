import { err, ok, Result } from 'neverthrow';
import { Form } from './form.entity';
import { FormStatus } from './status.enum';
import { FormsError } from './errors';

export interface AccessContext {
  actorId: string;
  isModerator?: boolean;
}

export type AccessDecision =
  { allowed: true } | { allowed: false; reason?: string };

export const AccessDecision = {
  allowed: { allowed: true },
  denied: (reason: string) => ({ allowed: false, reason }),

  toResult<T>(dec: AccessDecision, value: T): Result<T, FormsError> {
    return dec.allowed
      ? ok(value)
      : err(FormsError.forbidden(dec.reason ?? ''));
  },
};

const enum Role {
  Public = 1 << 0,
  Moderator = 1 << 1,
  Submitter = 1 << 2,
}

const VIEW_POLICY: Record<FormStatus, Role> = {
  [FormStatus.Draft]: Role.Submitter,
  [FormStatus.Pending]: Role.Submitter | Role.Moderator,
  [FormStatus.Reviewing]: Role.Submitter | Role.Moderator,
  [FormStatus.Approved]: Role.Submitter | Role.Moderator | Role.Public,
  [FormStatus.Rejected]: Role.Submitter,
  [FormStatus.Canceled]: Role.Submitter,
};

function ctxToRole(form: Form, ctx: AccessContext): Role {
  if (ctx.isModerator) {
    return Role.Moderator;
  } else if (ctx.actorId == form.submitterId) {
    return Role.Submitter;
  } else {
    return Role.Public;
  }
}

function checkAccess(
  form: Form,
  ctx: AccessContext,
  maskRequired: Role,
  denyReason: string = 'forbidden',
): AccessDecision {
  const role = ctxToRole(form, ctx);
  return (role & maskRequired) !== 0
    ? AccessDecision.allowed
    : AccessDecision.denied(denyReason);
}

export const FormAccess = {
  canView(form: Form, ctx: AccessContext): AccessDecision {
    return checkAccess(form, ctx, VIEW_POLICY[form.status], 'can not see form');
  },

  canCancel(form: Form, ctx: AccessContext): AccessDecision {
    return checkAccess(
      form,
      ctx,
      Role.Submitter,
      'form can be canceled only by submitter',
    );
  },

  canMarkReady(form: Form, ctx: AccessContext): AccessDecision {
    return checkAccess(
      form,
      ctx,
      Role.Submitter,
      'form can be marked ready only by submitter',
    );
  },
};
