export type CategoryDto =
  | { id: string; name: string }
  | { id: string; name: string; parent: CategoryDto };

export type OrganizationWithCategoryDto = {
  id: string;
  name: string;
  category: CategoryDto;
};
