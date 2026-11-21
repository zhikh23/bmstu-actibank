export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string | undefined;
  fullName: string;
}

export interface StudentSummary {
  id: string;
  fullName: string;
}
