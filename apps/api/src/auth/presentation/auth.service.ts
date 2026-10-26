import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthRequest, AuthResponse } from './http.types';
import { AuthenticatedUser } from '../domain/user.entity';
import { Role } from '../domain/role.enum';
import { OidcAdapter } from '../infrastructure/oidc/oidc.adapter';
import { GetUserBySubjectHandler } from '../use-case/get-user-by-subject/get-user-by-subject.handler';

const SESSION_COOKIE = 'actibank_session';
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

@Injectable()
export class AuthService {
  private readonly sessions = new Map<
    string,
    { user: AuthenticatedUser; expiresAt: number }
  >();

  constructor(
    private readonly oidc: OidcAdapter,
    private readonly getUserBySubject: GetUserBySubjectHandler,
  ) {}

  async login(response: AuthResponse): Promise<void> {
    const { url } = await this.oidc.login();
    response.redirect(url);
  }

  async callback(
    code: string,
    state: string,
    response: AuthResponse,
  ): Promise<void> {
    const claims = await this.oidc.callback(code, state);
    const result = await this.getUserBySubject.run(claims.sub);
    if (result.isErr()) throw new Error(result.error.message);
    const user = result.value;
    if (!user) throw new ForbiddenException('Forbidden');
    const sessionId = this.oidc.newSessionId();
    const authenticated: AuthenticatedUser = {
      id: user.id,
      subject: user.subject,
      roles: user.roles.map((role) => role as Role),
    };
    this.sessions.set(sessionId, {
      user: authenticated,
      expiresAt: Date.now() + SESSION_TTL_MS,
    });
    response.cookie(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      secure: this.secureCookies(),
      sameSite: 'lax',
      maxAge: SESSION_TTL_MS,
      path: '/',
    });
    response.redirect('/');
  }

  logout(request: AuthRequest, response: AuthResponse): void {
    const sessionId = this.getCookie(request, SESSION_COOKIE);
    if (sessionId) this.sessions.delete(sessionId);
    response.clearCookie(SESSION_COOKIE, {
      httpOnly: true,
      secure: this.secureCookies(),
      sameSite: 'lax',
      path: '/',
    });
    response.status(204).send();
  }

  async getSessionUser(
    request: AuthRequest,
  ): Promise<AuthenticatedUser | undefined> {
    const sessionId = this.getCookie(request, SESSION_COOKIE);
    const session = sessionId ? this.sessions.get(sessionId) : undefined;
    if (!session) return undefined;
    if (session.expiresAt <= Date.now()) {
      this.sessions.delete(sessionId!);
      return undefined;
    }
    return session.user;
  }

  private secureCookies(): boolean {
    return (
      process.env.NODE_ENV === 'production' ||
      process.env.COOKIE_SECURE === 'true'
    );
  }

  private getCookie(request: AuthRequest, name: string): string | undefined {
    const header = request.headers.cookie;
    return header
      ?.split(';')
      .map((part: string) => part.trim().split('='))
      .find(([key]: string[]) => key === name)?.[1];
  }
}
