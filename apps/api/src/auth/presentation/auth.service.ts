import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRequest, AuthResponse } from './http.types';
import { AuthCallbackHandler } from '../use-case/auth-callback/auth-callback.handler';
import { err, errAsync, okAsync } from 'neverthrow';
import { AuthError } from '../domain/errors';
import { UserLoginHandler } from '../use-case/user-login/user-login.handler';
import { UserLogoutHandler } from '../use-case/user-logout/user-logout.handler';
import { AuthenticatedUser } from '../../shared/domain/authenticated-user.entity';
import { GetSessionUserHandler } from '../use-case/get-session-user/get-session-user.handler';
import { AuthenticatedUserDto } from './dto/authenticated-user.dto';

const SESSION_COOKIE = 'actibank_session';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userLogin: UserLoginHandler,
    private readonly authCallback: AuthCallbackHandler,
    private readonly userLogout: UserLogoutHandler,
    private readonly sessionUser: GetSessionUserHandler,
  ) {}

  async login(response: AuthResponse): Promise<void> {
    await this.userLogin
      .execute()
      .match((res) => response.redirect(res.url), this.handleError);
  }

  async callback(
    code: string,
    state: string,
    response: AuthResponse,
  ): Promise<void> {
    return this.authCallback.execute({ code, state }).match((res) => {
      response.cookie(SESSION_COOKIE, res.sessionId, {
        httpOnly: true,
        secure: this.secureCookies(),
        sameSite: 'lax',
        maxAge: res.maxAge,
        path: '/',
      });
      response.redirect('/');
    }, this.handleError);
  }

  async logout(request: AuthRequest, response: AuthResponse): Promise<void> {
    const sessionId = this.getCookie(request, SESSION_COOKIE);
    if (!sessionId) return;
    return this.userLogout.execute({ sessionId }).match(() => {
      response.clearCookie(SESSION_COOKIE, {
        httpOnly: true,
        secure: this.secureCookies(),
        sameSite: 'lax',
        path: '/',
      });
      response.status(204).send();
    }, this.handleError);
  }

  async getSessionUser(
    request: AuthRequest,
  ): Promise<AuthenticatedUser | null> {
    const sessionId = this.getCookie(request, SESSION_COOKIE);
    if (!sessionId) return null;
    return this.sessionUser
      .execute({ sessionId })
      .match((user) => user, this.handleError);
  }

  async getMe(request: AuthRequest): Promise<AuthenticatedUserDto> {
    const sessionId = this.getCookie(request, SESSION_COOKIE);
    if (!sessionId) {
      throw new UnauthorizedException('User is not authenticated');
    }
    return this.sessionUser
      .execute({ sessionId })
      .andThen((user) => {
        return user
          ? okAsync(user)
          : errAsync(AuthError.unauthorized('User is not authenticated'));
      })
      .match((user) => user, this.handleError);
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

  private handleError(error: AuthError): never {
    switch (error.kind) {
      case 'Unauthorized':
        throw new UnauthorizedException(error.message);
      default:
        this.logger.error(err);
        throw new InternalServerErrorException();
    }
  }
}
