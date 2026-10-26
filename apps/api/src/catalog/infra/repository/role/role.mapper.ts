import { RoleWithCategory } from './role-with-category.read-model';
import { RoleModel } from './role.model';

export class RoleWithCategoryMapper {
  static toReadModel(m: RoleModel): RoleWithCategory {
    return {
      id: m.id,
      name: m.name,
      category: {
        id: m.category.id,
        name: m.category.name,
      },
    };
  }
}
