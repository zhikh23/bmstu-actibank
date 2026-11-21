import {RoleCategory} from "@/types/role";
import {Role} from "@/types/role-category";
import {makeAutoObservable, runInAction} from "mobx";

export interface RolesApi {
  getRoleCategories(): Promise<RoleCategory[]>
  getCategoryRoles(categoryId: string): Promise<Role[]>
}

export class RolesStore {
  categories: RoleCategory[] = [];
  roles: Record<string, Role> = {};
  loadingCategories: boolean = false;
  loadingRoles: boolean = false;
  categoriesError: string | null = null;
  rolesError: string | null = null;

  private categoriesLoaded = false;

  constructor(private api: RolesApi) {
    makeAutoObservable(this);
  }

  async loadCategories(force: boolean = false): Promise<void> {
    if (this.categoriesLoaded && !force) return;

    this.loadingCategories = true;

    try {
      const categories = await this.api.getRoleCategories();
      runInAction(() => {
        this.categories = categories;
        this.categoriesLoaded = true;
      });
    } catch (cause) {
      runInAction(() => {
        this.categoriesError = 'Не удалось загрузить категории.';
      });
      console.error('RolesStore: roles request failed', cause);
    } finally {
      runInAction(() => {
        this.loadingCategories = false;
      });
    }
  }

  async loadRoles(categoryId: string): Promise<void> {
    this.loadingRoles = true;
    this.rolesError = null;

    try {
      const roles = await this.api.getCategoryRoles(categoryId);
      runInAction(() => {
        roles.forEach(role => {
          this.roles[role.id] = role;
        });
      })
    } catch (cause) {
      runInAction(() => {
        this.rolesError = 'Не удалось загрузить роли.';
      });
      console.error('RolesStore: roles request failed', cause);
    } finally {
      runInAction(() => {
        this.loadingRoles = false;
      })
    }
  }
}
