import { Inject, Injectable } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { ResultAsync } from 'neverthrow';
import { AuthenticatedUser } from '../../../shared/domain/authenticated-user.entity';
import { AuthError } from '../../domain/errors';
import { SessionEntity } from '../../domain/session.entity';

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
