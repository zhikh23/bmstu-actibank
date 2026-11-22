export type UserRole = 'applicant' | 'moderator';

export const UserRole = {
  all: () => {
    return ['applicant', 'moderator'];
  },
};

export interface Me {
  id: string;
  subject: string;
  roles: UserRole[];
}
