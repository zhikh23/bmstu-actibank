import { EventEntity } from '@/events/domain/event.entity';
import {
  AuthenticatedUser,
  UserRole,
} from '@/shared/domain/authenticated-user.entity';

export type AccessDecision =
  { allowed: true } | { allowed: false; reason?: string };

export enum EventLocalRole {
  Moderator,
  Submitter,
  TeamMember,
}

export const EventAccessPolicy = {
  resolveRole(
    event: EventEntity,
    actor: AuthenticatedUser,
  ): Set<EventLocalRole> {
    const roles = new Set<EventLocalRole>();
    if (actor.roles.includes(UserRole.Moderator)) {
      roles.add(EventLocalRole.Moderator);
    }
    if (actor.id === event.submitterId) {
      roles.add(EventLocalRole.Submitter);
    }
    if (event.isTeamMember(actor.id)) {
      roles.add(EventLocalRole.TeamMember);
    }
    return roles;
  },

  canView(event: EventEntity, actor: AuthenticatedUser): AccessDecision {
    const roles = this.resolveRole(event, actor);
    return roles.has(EventLocalRole.Moderator) ||
      roles.has(EventLocalRole.Submitter) ||
      roles.has(EventLocalRole.TeamMember)
      ? { allowed: true }
      : { allowed: false, reason: 'Forbidden' };
  },
};
