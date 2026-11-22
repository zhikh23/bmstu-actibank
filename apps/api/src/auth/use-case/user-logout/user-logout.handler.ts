import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';

import { AuthError } from '@/auth/domain/errors';

export type UserLogoutCommand = {
  sessionId: string;
};

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
