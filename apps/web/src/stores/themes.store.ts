import {makeAutoObservable, runInAction} from "mobx";
import {Theme} from "@/types/catalog";

export interface CatalogApi {
  getThemes(): Promise<Theme[]>
}

export class ThemesStore {
  items: Theme[] = []
  loading: boolean = false;
  error: string | null = null;

  private loaded: boolean = false;

  constructor(private api: CatalogApi) {
    makeAutoObservable(this)
  }

  async load(force: boolean = false): Promise<void> {
    if (this.loaded && !force) return;
    this.loading = true;
    this.error = null;
    try {
      const items = await this.api.getThemes();
      runInAction(() => {
        this.items = items;
        this.loaded = true;
      })
    } catch (cause) {
      runInAction(() => {
        this.error = 'Не удалось загрузить темы. Попробуйте ещё раз.';
      });
      console.error('ThemesStore: request failed', cause);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}
