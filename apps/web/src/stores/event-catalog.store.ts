import { makeAutoObservable, runInAction } from 'mobx';

import type { CatalogOption } from '@/types/catalog';

export interface EventCatalogApi {
  getLevels(): Promise<CatalogOption[]>;
  getFormats(): Promise<CatalogOption[]>;
  getEventTypes(): Promise<CatalogOption[]>;
}

export class EventCatalogStore {
  levels: CatalogOption[] = [];
  formats: CatalogOption[] = [];
  types: CatalogOption[] = [];
  loading = false;
  error: string | null = null;

  private loaded = false;

  constructor(private api: EventCatalogApi) {
    makeAutoObservable(this);
  }

  async load(force = false): Promise<void> {
    if (this.loaded && !force) return;

    this.loading = true;
    this.error = null;

    try {
      const [levels, formats, types] = await Promise.all([
        this.api.getLevels(),
        this.api.getFormats(),
        this.api.getEventTypes(),
      ]);

      runInAction(() => {
        this.levels = levels;
        this.formats = formats;
        this.types = types;
        this.loaded = true;
      });
    } catch (cause) {
      runInAction(() => {
        this.error = 'Не удалось загрузить справочники мероприятия.';
      });
      console.error('EventCatalogStore: request failed', cause);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}
