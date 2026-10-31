import {
  SetMetadata,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import {
  AuthenticatedUser,
  UserRole,
} from '../../shared/domain/authenticated-user.entity';

export const IS_PUBLIC = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC, true);
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedUser =>
    (ctx.switchToHttp().getRequest() as { user: AuthenticatedUser }).user,
);
