import { Injectable } from '@nestjs/common';

import { CatalogService } from '@/catalog/presentation/catalog.service';
import { GetAllRoleCategoriesHandler } from '@/catalog/use-cases/get-all-role-categories/get-all-role-categories.handler';
import { GetCategoryRolesHandler } from '@/catalog/use-cases/get-category-roles/get-category-roles.handler';
import { ResolveRolesHandler } from '@/catalog/use-cases/resolve-roles/resolve-roles.handler';
import { RoleCategoryDto } from '@/shared/presentation/dto/role-category.dto';
import { RoleWithCategoryDto } from '@/shared/presentation/dto/role-with-category.dto';
import { RoleDto } from '@/shared/presentation/dto/role.dto';

@Injectable()
export class RolesService extends CatalogService {
  constructor(
    private readonly allRoleCategories: GetAllRoleCategoriesHandler,
    private readonly categoryRoles: GetCategoryRolesHandler,
    private readonly roles: ResolveRolesHandler,
  ) {
    super();
  }

  getAllRoleCategories(): Promise<RoleCategoryDto[]> {
    return this.resolve(this.allRoleCategories.execute());
  }

  getCategoryRoles(categoryId: string): Promise<RoleDto[]> {
    return this.resolve(this.categoryRoles.execute({ categoryId }));
  }

  resolveRoles(ids: string[]): Promise<RoleWithCategoryDto[]> {
    return this.resolve(this.roles.execute({ ids }));
  }
}
