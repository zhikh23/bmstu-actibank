import { makeAutoObservable, runInAction } from 'mobx';

import { RoleWithCategory } from '@/types/role-with-category';

export interface RoleApi {
  resolveRoles(ids: string[]): Promise<RoleWithCategory[]>;
}

export class SelectedRolesStore {
  ids: string[] = [];
  byId: Map<string, RoleWithCategory> = new Map();
  loading: boolean = false;
  error: string | null = null;

  constructor(private api: RoleApi) {
    makeAutoObservable(this);
  }

  get venues(): RoleWithCategory[] {
    return this.ids.flatMap((id) => this.byId.get(id) ?? []);
  }

  setIds(ids: string[]): void {
    this.ids = ids;
  }

  async loadRoles(): Promise<void> {
    const toFetch = this.ids.filter((id) => !this.byId.has(id));
    if (toFetch.length === 0) return;
    this.loading = true;
    try {
      const items = await this.api.resolveRoles(toFetch);
      runInAction(() => {
        items.forEach((item) => {
          this.byId.set(item.id, item);
        });
      });
    } catch (cause) {
      runInAction(() => {
        this.error = cause instanceof Error ? cause.message : null;
      });
      console.error('SelectedRolesStore: roles request failed', cause);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  remove(idToRemove: string): void {
    this.ids = this.ids.filter((id) => id !== idToRemove);
    this.byId.delete(idToRemove);
  }
}
