export interface FormDraft {
  name: string;
  description: string;
  organizers: string[];
  links: string[];
  venues: string[];
  themes: string[];
  start: Date | null;
  end: Date | null;
  formatId: string | null;
  typeId: string | null;
  levelId: string | null;
  participants_students: number | null;
  participants_employees: number | null;
  participants_others: number | null;
  guests: {
    userId: string;
    rankId: string;
  }[];
  team: {
    userId: string;
    roleId: string;
  }[];
}

export const defaultFormDraft: FormDraft = {
  name: '',
  description: '',
  organizers: [],
  links: [],
  venues: [],
  themes: [],
  start: null,
  end: null,
  formatId: null,
  typeId: null,
  levelId: null,
  participants_students: null,
  participants_employees: null,
  participants_others: null,
  guests: [],
  team: [],
};
