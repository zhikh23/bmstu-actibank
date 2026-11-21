import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';

import { AuthError } from '@/auth/domain/errors';
import { SessionEntity } from '@/auth/domain/session.entity';
import { AuthenticatedUser } from '@/shared/domain/authenticated-user.entity';

export type GetSessionUserQuery = {
  sessionId: string;
};

@Injectable()
export class GetSessionUserHandler {
  constructor(@Inject(CACHE_MANAGER) private readonly sessions: Cache) {}

  execute(
    cmd: GetSessionUserQuery,
  ): ResultAsync<AuthenticatedUser | null, AuthError> {
    return ResultAsync.fromPromise(
      this.sessions.get<SessionEntity>('session:' + cmd.sessionId),
      (error): AuthError =>
        AuthError.repository(
          error instanceof Error ? error.message : String(error),
        ),
    ).map((session) => {
      return session ? session.user : null;
    });
  }
}
