import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ResultAsync, errAsync, okAsync } from 'neverthrow';

import { AuthError } from '@/auth/domain/errors';
import { OidcAdapter } from '@/auth/infrastructure/oidc/oidc.adapter';
import { UserRepository } from '@/auth/infrastructure/repositories/user.repository';
import { AuthenticatedUser } from '@/shared/domain/authenticated-user.entity';
import { UUID_PORT, UuidPort } from '@/shared/infra/uuid/uuid.port';

const SESSION_TTL_MS = 1000 * 60 * 60 * 8;

export type AuthCallbackCommand = {
  code: string;
  state: string;
};

export type AuthCallbackResult = {
  sessionId: string;
  maxAge: number;
  returnTo: string;
};

@Injectable()
export class AuthCallbackHandler {
  constructor(
    private readonly oidc: OidcAdapter,
    private readonly users: UserRepository,
    @Inject(UUID_PORT) private readonly uuid: UuidPort,
    @Inject(CACHE_MANAGER) private readonly sessions: Cache,
  ) {}

  execute(
    cmd: AuthCallbackCommand,
  ): ResultAsync<AuthCallbackResult, AuthError> {
    return this.oidc
      .callback(cmd.code, cmd.state)
      .andThen(({ claims, returnTo }) =>
        this.users.getOrNull(claims.sub).map((user) => ({ user, returnTo })),
      )
      .andThen(({ user, returnTo }) => {
        return user
          ? okAsync({
              user: new AuthenticatedUser(user.id, user.subject, user.roles),
              returnTo,
            })
          : errAsync(AuthError.unauthorized('forbidden'));
      })
      .andThen(({ user, returnTo }) => {
        const sessionId = this.uuid.generate();
        return ResultAsync.fromPromise(
          this.sessions.set('session:' + sessionId, {
            user,
            expiresAt: Date.now() + SESSION_TTL_MS,
          }),
          (error): AuthError =>
            AuthError.repository(
              error instanceof Error ? error.message : String(error),
            ),
        ).map(() => ({
          sessionId,
          maxAge: SESSION_TTL_MS,
          returnTo,
        }));
      });
  }
}
