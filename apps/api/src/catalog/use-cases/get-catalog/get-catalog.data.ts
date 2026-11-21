export type RoleCategoryType = {
  id: string;
  name: string;
};

export type RoleType = {
  id: string;
  name: string;
};

export type RoleWithCategoryType = {
  id: string;
  name: string;
  category: RoleCategoryType;
};

export type OrganizationType = {
  id: string;
  name: string;
  categoryId: string;
};
