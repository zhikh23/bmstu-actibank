import { makeAutoObservable, runInAction } from 'mobx';

import { Organization } from '@/types/catalog';

export interface CatalogApi {
  getOrganizations(): Promise<Organization[]>;
}

export class OrganizationsStore {
  items: Organization[] = [];
  loading: boolean = false;
  error: string | null = null;

  private loaded: boolean = false;

  constructor(private api: CatalogApi) {
    makeAutoObservable(this);
  }

  async load(force: boolean = false): Promise<void> {
    if (this.loaded && !force) return;
    this.loading = true;
    this.error = null;
    try {
      const items = await this.api.getOrganizations();
      runInAction(() => {
        this.items = items;
        this.loaded = true;
      });
    } catch (cause) {
      runInAction(() => {
        this.error = 'Не удалось загрузить организации. Попробуйте ещё раз.';
      });
      console.error('OrganizationsStore: request failed', cause);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}
