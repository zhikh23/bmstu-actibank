export type FormStatus =
  | 'draft'
  | 'pending'
  | 'approved'
  | 'reviewing'
  | 'canceled'
  | 'rejected';

export const FormStatus = {
  all: () => {
    return [
      'draft',
      'pending',
      'approved',
      'reviewing',
      'canceled',
      'rejected'
    ]
  }
}

export type UserRole = 'applicant' | 'moderator';

export const UserRole = {
  all: () => {
    return ['applicant', 'moderator'];
  }
}

export interface Me {
  id: string;
  subject: string;
  roles: UserRole[];
}

export interface FormsListItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  start: Date;
  end: Date;
  status: FormStatus;
  submitterId: string;
  createdAt: Date;
}
