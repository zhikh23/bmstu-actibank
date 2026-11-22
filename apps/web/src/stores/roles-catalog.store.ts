import { makeAutoObservable, runInAction } from 'mobx';

import { Role } from '@/types/role';
import { RoleCategory } from '@/types/role-category';

export interface RolesApi {
  getRoleCategories(): Promise<RoleCategory[]>;
  getCategoryRoles(categoryId: string): Promise<Role[]>;
}

export class RolesCatalogStore {
  categories: RoleCategory[] = [];
  rolesByCategories: Map<string, Role[]> = new Map();
  loadingCategories: boolean = false;
  loadingRoles: Set<string> = new Set();
  categoriesError: string | null = null;
  rolesError: Map<string, string | null> = new Map();

  private categoriesLoaded = false;

  constructor(private api: RolesApi) {
    makeAutoObservable(this);
  }

  categoryRoles(categoryId: string): Role[] {
    return this.rolesByCategories.get(categoryId) ?? [];
  }

  isLoadingRoles(categoryId: string): boolean {
    return this.loadingRoles.has(categoryId);
  }

  async loadCategories(force: boolean = false): Promise<void> {
    if (this.categoriesLoaded && !force) return;

    this.loadingCategories = true;
    this.categoriesError = null;

    try {
      const categories = await this.api.getRoleCategories();
      runInAction(() => {
        this.categories = categories;
        this.categoriesLoaded = true;
      });
    } catch (cause) {
      runInAction(() => {
        this.categoriesError =
          cause instanceof Error ? cause.message : String(cause);
      });
      console.error('RolesStore: roles request failed', cause);
    } finally {
      runInAction(() => {
        this.loadingCategories = false;
      });
    }
  }

  async loadRoles(categoryId: string): Promise<void> {
    this.loadingRoles.add(categoryId);
    this.rolesError.set(categoryId, null);

    try {
      const roles = await this.api.getCategoryRoles(categoryId);
      runInAction(() => {
        this.rolesByCategories.set(categoryId, roles);
      });
    } catch (cause) {
      runInAction(() => {
        this.rolesError.set(
          categoryId,
          cause instanceof Error ? cause.message : String(cause),
        );
      });
      console.error('RolesStore: roles request failed', cause);
    } finally {
      runInAction(() => {
        this.loadingRoles.delete(categoryId);
      });
    }
  }
}
