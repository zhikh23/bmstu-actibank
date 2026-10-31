import { Inject, Injectable } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { UserLogoutCommand } from './user-logout.data';
import { ResultAsync } from 'neverthrow';
import { AuthError } from '../../domain/errors';

@Injectable()
export class UserLogoutHandler {
  constructor(@Inject(CACHE_MANAGER) private readonly sessions: Cache) {}

  execute(cmd: UserLogoutCommand): ResultAsync<boolean, AuthError> {
    return ResultAsync.fromPromise(
      this.sessions.del('session:' + cmd.sessionId),
      (error): AuthError =>
        AuthError.repository(
          error instanceof Error ? error.message : String(error),
        ),
    );
  }
}
