import { RoleWithCategory } from './role-with-category.read-model';
import { RoleModel } from './role.model';
import { Role } from '../../../domain/role.entity';

export class RoleMapper {
  static toDomain(m: RoleModel): Role {
    return new Role(m.id, m.name);
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
