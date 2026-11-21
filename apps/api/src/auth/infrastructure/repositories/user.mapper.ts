import { AuthenticatedUser } from '@/shared/domain/authenticated-user.entity';

import { UserModel } from './user.model';

export class UserMapper {
  static toDomain(u: UserModel): AuthenticatedUser {
    return {
      id: u.id,
      subject: u.subject,
      roles: u.roles.map((r) => r.role),
    };
  }
}
