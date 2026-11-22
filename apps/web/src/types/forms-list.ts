import { FormStatus } from '@/types/form-status';

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

export type FormsList = FormsListItem[];
