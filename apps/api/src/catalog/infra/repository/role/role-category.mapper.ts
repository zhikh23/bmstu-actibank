import { RoleCategory } from '@/catalog/domain/role-category.entity';

import { RoleCategoryModel } from './role.model';

export class RoleCategoryMapper {
  static toDomain(m: RoleCategoryModel): RoleCategory {
    return new RoleCategory(m.id, m.priority, m.name);
  }
}
