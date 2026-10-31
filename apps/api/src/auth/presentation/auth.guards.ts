import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC } from './auth.decorators';
import { AuthService } from './auth.service';
import { AuthRequest } from './http.types';
import {
  AuthenticatedUser,
  UserRole,
} from '../../shared/domain/authenticated-user.entity';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly auth: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (
      this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
        context.getHandler(),
        context.getClass(),
      ])
    ) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthRequest>();
    const user = await this.auth.getSessionUser(request);
    if (!user) throw new UnauthorizedException();
    (request as AuthRequest & { user: AuthenticatedUser }).user = user;
    return true;
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles?.length) return true;
    const user = context
      .switchToHttp()
      .getRequest<AuthRequest & { user?: AuthenticatedUser }>().user as
      AuthenticatedUser | undefined;
    if (!user) throw new UnauthorizedException();
    if (!roles.some((role) => user.roles.includes(role))) {
      throw new ForbiddenException();
    }
    return true;
  }
}
