import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createHash,
  createPublicKey,
  randomBytes,
  randomUUID,
  verify,
} from 'node:crypto';

type OidcMetadata = {
  authorization_endpoint: string;
  token_endpoint: string;
  jwks_uri: string;
  issuer: string;
};

type OidcClaims = {
  sub: string;
  iss: string;
  aud: string | string[];
  exp: number;
  nonce?: string;
};
type Jwk = { kty: string; n: string; e: string; kid?: string };

export type LoginState = { state: string; nonce: string; verifier: string };

@Injectable()
export class OidcAdapter {
  private metadata?: OidcMetadata;
  private readonly pending = new Map<string, LoginState>();

  constructor(private readonly config: ConfigService) {}

  async login(): Promise<{ url: string; state: LoginState }> {
    const metadata = await this.getMetadata();
    const state = randomBytes(32).toString('base64url');
    const nonce = randomBytes(32).toString('base64url');
    const verifier = randomBytes(32).toString('base64url');
    this.pending.set(state, { state, nonce, verifier });
    const challenge = createHash('sha256').update(verifier).digest('base64url');
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.required('OIDC_CLIENT_ID'),
      redirect_uri: this.required('OIDC_REDIRECT_URI'),
      scope: this.config.get('OIDC_SCOPES', 'openid profile'),
      state,
      nonce,
      code_challenge: challenge,
      code_challenge_method: 'S256',
    });
    return {
      url: `${metadata.authorization_endpoint}?${params}`,
      state: this.pending.get(state)!,
    };
  }

  async callback(code: string, state: string): Promise<OidcClaims> {
    const pending = this.pending.get(state);
    this.pending.delete(state);
    if (!pending) throw new UnauthorizedException('Invalid OIDC state');
    const metadata = await this.getMetadata();
    const response = await fetch(metadata.token_endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: this.required('OIDC_CLIENT_ID'),
        client_secret: this.required('OIDC_CLIENT_SECRET'),
        redirect_uri: this.required('OIDC_REDIRECT_URI'),
        code_verifier: pending.verifier,
      }),
    });
    if (!response.ok)
      throw new UnauthorizedException('OIDC token exchange failed');
    const body = (await response.json()) as { id_token?: string };
    if (!body.id_token)
      throw new UnauthorizedException('OIDC did not return an ID token');
    return await this.verifyIdToken(body.id_token, metadata, pending.nonce);
  }

  newSessionId(): string {
    return randomUUID();
  }

  private async getMetadata(): Promise<OidcMetadata> {
    if (this.metadata) return this.metadata;
    const issuer = this.required('OIDC_ISSUER').replace(/\/$/, '');
    const response = await fetch(`${issuer}/.well-known/openid-configuration`);
    if (!response.ok) throw new UnauthorizedException('OIDC discovery failed');
    this.metadata = (await response.json()) as OidcMetadata;
    return this.metadata;
  }

  private async verifyIdToken(
    token: string,
    metadata: OidcMetadata,
    nonce: string,
  ): Promise<OidcClaims> {
    const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');
    if (!encodedHeader || !encodedPayload || !encodedSignature)
      throw new UnauthorizedException('Invalid ID token');
    const header = JSON.parse(
      Buffer.from(encodedHeader, 'base64url').toString(),
    ) as { kid?: string; alg?: string };
    if (header.alg !== 'RS256' || !header.kid)
      throw new UnauthorizedException('Unsupported ID token');
    const keysResponse = await fetch(metadata.jwks_uri);
    if (!keysResponse.ok)
      throw new UnauthorizedException('OIDC JWKS lookup failed');
    const keys = (await keysResponse.json()) as { keys: Jwk[] };
    const jwk = keys.keys.find((key) => key.kid === header.kid);
    if (!jwk) throw new UnauthorizedException('Unknown ID token key');
    const valid = verify(
      'RSA-SHA256',
      Buffer.from(`${encodedHeader}.${encodedPayload}`),
      createPublicKey({ key: jwk as never, format: 'jwk' }),
      Buffer.from(encodedSignature, 'base64url'),
    );
    if (!valid) throw new UnauthorizedException('Invalid ID token signature');
    const claims = JSON.parse(
      Buffer.from(encodedPayload, 'base64url').toString(),
    ) as OidcClaims;
    const issuer = this.required('OIDC_ISSUER').replace(/\/$/, '');
    const audience = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
    if (
      claims.iss !== issuer ||
      !audience.includes(this.required('OIDC_CLIENT_ID')) ||
      claims.exp <= Math.floor(Date.now() / 1000) ||
      claims.nonce !== nonce
    ) {
      throw new UnauthorizedException('Invalid ID token claims');
    }
    return claims;
  }

  private required(name: string): string {
    const value = this.config.get<string>(name);
    if (!value) throw new Error(`${name} is required`);
    return value;
  }
}
