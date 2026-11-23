export interface CreateEventInput {
  slug: string;
  formId: string;
  name: string;
  description: string;
  organizers: string[];
  links: string[];
  venues: string[];
  themes: string[];
  start: Date;
  end: Date;
  formatId: string;
  typeId: string;
  levelId: string;
  participants: {
    students: number;
    employees: number;
    others: number;
  };
  guests: {
    userId: string;
    rankId: string;
  }[];
  team: {
    userId: string;
    roleId: string;
  }[];
  signedScanId: string;
  submitterId: string;
  reviewedBy: string;
}
