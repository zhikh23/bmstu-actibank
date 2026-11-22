import { makeAutoObservable, runInAction } from 'mobx';

import { VenueWithBuilding } from '@/types/venue-with-building';

export interface VenueApi {
  resolveVenues(ids: string[]): Promise<VenueWithBuilding[]>;
}

export class SelectedVenuesStore {
  ids: string[] = [];
  byId: Map<string, VenueWithBuilding> = new Map();
  loading: boolean = false;
  error: string | null = null;

  constructor(private api: VenueApi) {
    makeAutoObservable(this);
  }

  get venues(): VenueWithBuilding[] {
    return this.ids.flatMap((id) => this.byId.get(id) ?? []);
  }

  setIds(ids: string[]): void {
    this.ids = ids;
  }

  async loadVenues(): Promise<void> {
    const toFetch = this.ids.filter((id) => !this.byId.has(id));
    if (toFetch.length === 0) return;
    this.loading = true;
    try {
      const items = await this.api.resolveVenues(toFetch);
      runInAction(() => {
        items.forEach((item) => {
          this.byId.set(item.id, item);
        });
      });
    } catch (cause) {
      runInAction(() => {
        this.error = cause instanceof Error ? cause.message : null;
      });
      console.error('SelectedVenuesStore: venues request failed', cause);
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
