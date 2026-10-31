import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, createPublicKey, randomBytes, verify } from 'node:crypto';
import { errAsync, okAsync, ResultAsync } from 'neverthrow';
import { AuthError } from '../../domain/errors';

type OidcMetadata = {
  authorization_endpoint: string;
  token_endpoint: string;
  jwks_uri: string;
  issuer: string;
};

export type OidcClaims = {
  sub: string;
  iss: string;
  aud: string | string[];
  exp: number;
  nonce?: string;
};

type Jwk = {
  kty: string;
  n: string;
  e: string;
  kid?: string;
};

type IdTokenHeader = {
  alg?: string;
  kid?: string;
};

type TokenResponse = {
  id_token?: string;
};

export type LoginState = {
  state: string;
  nonce: string;
  verifier: string;
};

export type LoginResult = {
  url: string;
  state: LoginState;
};

const DISCOVERY_ERROR = 'OIDC discovery failed';
const TOKEN_ERROR = 'OIDC token exchange failed';
const ID_TOKEN_ERROR = 'Invalid ID token';

@Injectable()
export class OidcAdapter {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;
  private readonly scopes: string;
  private readonly issuer: string;

  private metadata?: OidcMetadata;
  private readonly pending = new Map<string, LoginState>();

  constructor(config: ConfigService) {
    this.clientId = config.getOrThrow<string>('OIDC_CLIENT_ID');
    this.clientSecret = config.getOrThrow<string>('OIDC_CLIENT_SECRET');
    this.redirectUri = config.getOrThrow<string>('OIDC_REDIRECT_URI');
    this.scopes = config.get<string>('OIDC_SCOPES', 'openid profile');
    this.issuer = this.normalizeIssuer(
      config.getOrThrow<string>('OIDC_ISSUER'),
    );
  }

  login(): ResultAsync<LoginResult, AuthError> {
    return this.getMetadata().map((metadata) => {
      const state = this.randomValue();
      const loginState: LoginState = {
        state,
        nonce: this.randomValue(),
        verifier: this.randomValue(),
      };

      this.pending.set(state, loginState);

      const params = new URLSearchParams({
        response_type: 'code',
        client_id: this.clientId,
        redirect_uri: this.redirectUri,
        scope: this.scopes,
        state,
        nonce: loginState.nonce,
        code_challenge: this.createCodeChallenge(loginState.verifier),
        code_challenge_method: 'S256',
      });

      return {
        url: `${metadata.authorization_endpoint}?${params.toString()}`,
        state: loginState,
      };
    });
  }

  callback(code: string, state: string): ResultAsync<OidcClaims, AuthError> {
    const loginState = this.pending.get(state);
    this.pending.delete(state);

    if (!loginState) {
      return errAsync(AuthError.unauthorized('Invalid OIDC state'));
    }

    return this.getMetadata().andThen((metadata) =>
      this.exchangeCode(code, loginState, metadata).andThen((idToken) =>
        this.verifyIdToken(idToken, metadata, loginState.nonce),
      ),
    );
  }

  private getMetadata(): ResultAsync<OidcMetadata, AuthError> {
    if (this.metadata) {
      return okAsync(this.metadata);
    }

    return ResultAsync.fromPromise(
      fetch(`${this.issuer}/.well-known/openid-configuration`),
      () => AuthError.unauthorized(DISCOVERY_ERROR),
    )
      .andThen((response) =>
        response.ok
          ? this.readJson<OidcMetadata>(response, DISCOVERY_ERROR)
          : errAsync(AuthError.unauthorized(DISCOVERY_ERROR)),
      )
      .andThen((metadata) => {
        if (!this.isOidcMetadata(metadata)) {
          return errAsync(AuthError.unauthorized(DISCOVERY_ERROR));
        }

        this.metadata = metadata;
        return okAsync(metadata);
      });
  }

  private exchangeCode(
    code: string,
    loginState: LoginState,
    metadata: OidcMetadata,
  ): ResultAsync<string, AuthError> {
    return ResultAsync.fromPromise(
      fetch(metadata.token_endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          client_id: this.clientId,
          client_secret: this.clientSecret,
          redirect_uri: this.redirectUri,
          code_verifier: loginState.verifier,
        }),
      }),
      () => AuthError.unauthorized(TOKEN_ERROR),
    )
      .andThen((response) =>
        response.ok
          ? this.readJson<TokenResponse>(response, TOKEN_ERROR)
          : errAsync(AuthError.unauthorized(TOKEN_ERROR)),
      )
      .andThen((body) =>
        this.isTokenResponse(body) && body.id_token
          ? okAsync(body.id_token)
          : errAsync(AuthError.unauthorized('OIDC did not return an ID token')),
      );
  }

  private verifyIdToken(
    token: string,
    metadata: OidcMetadata,
    nonce: string,
  ): ResultAsync<OidcClaims, AuthError> {
    return ResultAsync.fromPromise(
      Promise.resolve().then(async () => {
        const [encodedHeader, encodedPayload, encodedSignature] =
          token.split('.');
        if (!encodedHeader || !encodedPayload || !encodedSignature) {
          throw new Error(ID_TOKEN_ERROR);
        }

        const header = this.parseJson<IdTokenHeader>(
          Buffer.from(encodedHeader, 'base64url').toString(),
        );
        if (header.alg !== 'RS256' || !header.kid) {
          throw new Error('Unsupported ID token');
        }

        const keysResponse = await fetch(metadata.jwks_uri);
        if (!keysResponse.ok) {
          throw new Error('OIDC JWKS lookup failed');
        }

        const keys = (await keysResponse.json()) as { keys?: Jwk[] } | null;
        const jwk = keys?.keys?.find((key) => key.kid === header.kid);
        if (!jwk) {
          throw new Error('Unknown ID token key');
        }

        const valid = verify(
          'RSA-SHA256',
          Buffer.from(`${encodedHeader}.${encodedPayload}`),
          createPublicKey({ key: jwk, format: 'jwk' }),
          Buffer.from(encodedSignature, 'base64url'),
        );
        if (!valid) {
          throw new Error('Invalid ID token signature');
        }

        const claims = this.parseJson<OidcClaims>(
          Buffer.from(encodedPayload, 'base64url').toString(),
        );
        const audience = Array.isArray(claims.aud) ? claims.aud : [claims.aud];

        if (
          claims.iss !== this.issuer ||
          !audience.includes(this.clientId) ||
          claims.exp <= Math.floor(Date.now() / 1000) ||
          claims.nonce !== nonce
        ) {
          throw new Error('Invalid ID token claims');
        }

        return claims;
      }),
      (error) =>
        AuthError.unauthorized(
          error instanceof Error ? error.message : ID_TOKEN_ERROR,
        ),
    );
  }

  private readJson<T>(
    response: Response,
    errorMessage: string,
  ): ResultAsync<T, AuthError> {
    return ResultAsync.fromPromise(response.json() as Promise<T>, () =>
      AuthError.unauthorized(errorMessage),
    );
  }

  private parseJson<T>(value: string): T {
    return JSON.parse(value) as T;
  }

  private isOidcMetadata(value: unknown): value is OidcMetadata {
    if (!this.isRecord(value)) {
      return false;
    }

    return (
      typeof value.authorization_endpoint === 'string' &&
      typeof value.token_endpoint === 'string' &&
      typeof value.jwks_uri === 'string'
    );
  }

  private isTokenResponse(value: unknown): value is TokenResponse {
    return this.isRecord(value);
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }

  private randomValue(): string {
    return randomBytes(32).toString('base64url');
  }

  private createCodeChallenge(verifier: string): string {
    return createHash('sha256').update(verifier).digest('base64url');
  }

  private normalizeIssuer(issuer: string): string {
    return issuer.replace(/\/$/, '');
  }
}
