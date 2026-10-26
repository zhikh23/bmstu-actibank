export type CategoryType =
  | { id: string; name: string }
  | { id: string; name: string; parent: CategoryType };

export type OrganizationWithCategoryType = {
  id: string;
  name: string;
  category: CategoryType;
};
