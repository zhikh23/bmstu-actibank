import { Role } from './role.enum';

export { Role };

export interface AuthenticatedUser {
  id: string;
  subject: string;
  roles: Role[];
}
