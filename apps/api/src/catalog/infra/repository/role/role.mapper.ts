import { RoleWithCategory } from './role-with-category.read-model';
import { RoleModel } from './role.model';

export class RoleWithCategoryMapper {
  static toReadModel(m: RoleModel): RoleWithCategory {
    return {
      id: m.id,
      label: m.label,
      category: {
        id: m.category.id,
        label: m.category.label,
      },
    };
  }
}
