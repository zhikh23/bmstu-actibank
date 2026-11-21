import { Organization } from '@/catalog/domain/organization.entity';

import {
  Category,
  OrganizationWithCategory,
} from './organization-with-category.read-model';
import {
  OrganizationCategoryModel,
  OrganizationModel,
} from './organization.model';

export class OrganizationMapper {
  static toDomain(m: OrganizationModel): Organization {
    return new Organization(m.id, m.name, m.category_id);
  }
}

export class CategoryMapper {
  static toReadModel(m: OrganizationCategoryModel): Category {
    return m.parent
      ? { id: m.id, name: m.name, parent: CategoryMapper.toReadModel(m.parent) }
      : { id: m.id, name: m.name };
  }
}

export class OrganizationWithCategoryMapper {
  static toReadModel(m: OrganizationModel): OrganizationWithCategory {
    return {
      id: m.id,
      name: m.name,
      category: CategoryMapper.toReadModel(m.category),
    };
  }
}
