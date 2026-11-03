import { Injectable } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';
import { AuthError } from '../../domain/errors';
import { OidcAdapter } from '../../infrastructure/oidc/oidc.adapter';

export type UserLoginResult = {
  url: string;
};

@Injectable()
export class UserLoginHandler {
  constructor(private readonly oidc: OidcAdapter) {}

  execute(): ResultAsync<UserLoginResult, AuthError> {
    return this.oidc.login();
  }
}
