import { AuthenticatedUser } from '@/shared/domain/authenticated-user.entity';

export class SessionEntity {
  constructor(
    public id: string,
    public user: AuthenticatedUser,
  ) {}
}
