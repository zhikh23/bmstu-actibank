import {
  Category,
  OrganizationWithCategory,
} from './organization-with-category.read-model';
import {
  OrganizationCategoryModel,
  OrganizationModel,
} from './organization.model';

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
