import { RoleCategory } from './role-category';

export interface RoleWithCategory {
  id: string;
  name: string;
  category: RoleCategory;
}
