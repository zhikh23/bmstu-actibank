type FormOrganizationCategoryType = {
  id: string;
  name: string;
  parent?: FormOrganizationCategoryType | null;
};

export type FormType = {
  id: string;
  name: string;
  description: string;
  organizers: {
    id: string;
    name: string;
    category: FormOrganizationCategoryType;
  }[];
  links: string[];
  venues: {
    id: string;
    name: string;
    building: {
      id: string;
      name: string;
    };
  }[];
  themes: {
    id: string;
    name: string;
  }[];
  start: Date;
  end: Date;
  format: {
    id: string;
    name: string;
  };
  type: {
    id: string;
    name: string;
  };
  level: {
    id: string;
    name: string;
  };
  participants: {
    students: number;
    employees: number;
    others: number;
  };
  guests: {
    userId: string;
    rank: {
      id: string;
      name: string;
    };
  }[];
  team: {
    userId: string;
    role: {
      id: string;
      name: string;
      category: {
        id: string;
        name: string;
      };
    };
  }[];
  status: string;
  reason: string | null;
  submitterId: string;
  reviewerId: string | null;
  document: {
    id: string;
    generatedId: string;
    scanId: string | null;
    createdAt: Date;
    uploadedAt: Date | null;
  } | null;
  createdAt: Date;
  updatedAt: Date;
  reviewedAt: Date | null;
  canceledAt: Date | null;
};
