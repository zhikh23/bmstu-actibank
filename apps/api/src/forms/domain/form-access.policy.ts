import { err, ok, Result } from 'neverthrow';
import { Form } from './form.entity';
import { FormStatus } from './status.enum';
import { FormsError } from './errors';
import {
  AuthenticatedUser,
  UserRole,
} from '../../shared/domain/authenticated-user.entity';

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
  Public = 0,
  Moderator = 1 << 0,
  Submitter = 1 << 1,
}

function userToRole(user: AuthenticatedUser, form: Form): Role {
  let role = Role.Public;
  if (user.id === form.submitterId) role = role & Role.Submitter;
  if (user.roles.includes(UserRole.Moderator)) role = role & Role.Moderator;
  return role;
}

const VIEW_POLICY: Record<FormStatus, Role> = {
  [FormStatus.Draft]: Role.Submitter,
  [FormStatus.Pending]: Role.Submitter | Role.Moderator,
  [FormStatus.Reviewing]: Role.Submitter | Role.Moderator,
  [FormStatus.Approved]: Role.Submitter | Role.Moderator | Role.Public,
  [FormStatus.Rejected]: Role.Submitter,
  [FormStatus.Canceled]: Role.Submitter,
};

function checkAccess(
  form: Form,
  user: AuthenticatedUser,
  maskRequired: Role,
  denyReason: string = 'forbidden',
): AccessDecision {
  const role = userToRole(user, form);
  return (role & maskRequired) !== 0
    ? AccessDecision.allowed
    : AccessDecision.denied(denyReason);
}

export const FormAccess = {
  canView(form: Form, user: AuthenticatedUser): AccessDecision {
    return checkAccess(
      form,
      user,
      VIEW_POLICY[form.status],
      'can not see form',
    );
  },

  canConvertToDraft(form: Form, user: AuthenticatedUser): AccessDecision {
    return checkAccess(
      form,
      user,
      Role.Submitter | Role.Moderator,
      'form can be converted to draft only by submitter or moderator',
    );
  },

  canMarkReady(form: Form, user: AuthenticatedUser): AccessDecision {
    return checkAccess(
      form,
      user,
      Role.Submitter,
      'form can be marked ready only by submitter',
    );
  },

  canStartReview(form: Form, user: AuthenticatedUser): AccessDecision {
    return checkAccess(
      form,
      user,
      Role.Moderator,
      'form can be started review only by moderator',
    );
  },

  canApprove(form: Form, user: AuthenticatedUser): AccessDecision {
    return checkAccess(
      form,
      user,
      Role.Moderator,
      'form can be approved only by moderator',
    );
  },

  canReject(form: Form, user: AuthenticatedUser): AccessDecision {
    return checkAccess(
      form,
      user,
      Role.Moderator,
      'form can be rejected only by moderator',
    );
  },

  canCancel(form: Form, user: AuthenticatedUser): AccessDecision {
    return checkAccess(
      form,
      user,
      Role.Submitter,
      'form can be canceled only by submitter',
    );
  },
};
