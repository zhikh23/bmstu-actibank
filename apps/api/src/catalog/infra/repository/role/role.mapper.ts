import { Role } from '@/catalog/domain/role.entity';

import { RoleWithCategory } from './role-with-category.read-model';
import { RoleModel } from './role.model';

export class RoleMapper {
  static toDomain(m: RoleModel): Role {
    return new Role(m.id, m.category_id, m.name);
  }
}

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
