import { FormStatus } from '../../domain/status.enum';
import { AuthenticatedUser } from '../../../shared/domain/authenticated-user.entity';

export type ListFormsSortBy = 'createdAt' | 'start';
export type ListFormsSortOrder = 'asc' | 'desc';

export type ListFormsQuery = {
  actor: AuthenticatedUser;
  status?: FormStatus;
  sortBy?: ListFormsSortBy;
  sortOrder?: ListFormsSortOrder;
};

export type FormSummary = {
  id: string;
  slug: string;
  name: string;
  description: string;
  start: Date;
  end: Date;
  status: FormStatus;
  submitterId: string;
  createdAt: Date;
};
