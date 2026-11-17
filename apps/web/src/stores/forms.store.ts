import { makeAutoObservable, runInAction } from 'mobx'

import type { FormsListItem } from "@/types/domain";

export interface FormsApi {
  getFormsList(): Promise<FormsListItem[]>
}

export class FormsStore {
  items: FormsListItem[] = []
  loading = false
  error: string | null = null
  searchQuery = ''

  private loaded = false

  constructor(private api: FormsApi) {
    makeAutoObservable(this)
  }

  get filtered(): FormsListItem[] {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) return this.items;
    return this.items.filter((f) => f.name.toLowerCase().includes(query));
  }

  setSearchQuery(q: string): void {
    this.searchQuery = q
  }

  async load(force: boolean = false): Promise<void> {
    if (this.loaded && !force) return
    this.loading = true;
    this.error = null;
    try {
      const items = await this.api.getFormsList()
      runInAction(() => {
        this.items = items
        this.loaded = true
      })
    } catch (cause) {
      runInAction(() => {
        this.error = 'Не удалось загрузить заявки. Попробуйте ещё раз.'
      })
      console.error('FormsStore: request failed', cause)
    } finally {
      runInAction(() => {
        this.loading = false
      })
    }
  }
}
