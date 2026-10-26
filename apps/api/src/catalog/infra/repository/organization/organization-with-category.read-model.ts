export type Category =
  { id: string; name: string } | { id: string; name: string; parent: Category };

export type OrganizationWithCategory = {
  id: string;
  name: string;
  category: Category;
};
