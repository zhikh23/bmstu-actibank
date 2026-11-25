import { EventsList, EventsListItem } from '@/types/events-list';
import { makeAutoObservable, runInAction } from 'mobx';

export type SortBy = 'name' | 'start' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export interface ListEventsQuery {
  sortBy?: SortBy;
  sortOrder?: SortOrder;
  search?: string;
  start?: Date;
  end?: Date;
  organizerIds?: string[];
}

export interface EventsApi {
  listEvents(query: ListEventsQuery): Promise<EventsList>;
}

export class EventsStore {
  sortBy?: SortBy;
  sortOrder?: SortOrder;
  search?: string;
  start?: Date;
  end?: Date;
  organizerIds?: string[];

  items: EventsListItem[] = [];
  loading: boolean = false;
  error: string | null = null;

  private loaded = false;
  private requestVersion = 0;

  constructor(private api: EventsApi) {
    makeAutoObservable(this);
  }

  setSearch(search: string) {
    const next = search.trim() ? search : undefined;
    if (this.search === next) return;
    this.search = next;
    this.loaded = false;
  }

  setSort(sortBy: SortBy) {
    if (this.sortBy !== sortBy) {
      this.sortBy = sortBy;
      this.sortOrder = 'asc';
    } else if (this.sortOrder === 'asc') {
      this.sortOrder = 'desc';
    } else {
      this.sortBy = undefined;
      this.sortOrder = undefined;
    }
    this.loaded = false;
  }

  setSortBy(sortBy: SortBy) {
    if (this.sortBy === sortBy) return;
    this.sortBy = sortBy;
    this.sortOrder = 'asc';
    this.loaded = false;
  }

  setSortOrder(sortOrder: SortOrder) {
    if (this.sortOrder === sortOrder) return;
    this.sortOrder = sortOrder;
    this.loaded = false;
  }

  setOrganizerIds(organizerIds: string[]) {
    const next = organizerIds.length > 0 ? organizerIds : undefined;
    if (
      (next === undefined && this.organizerIds === undefined) ||
      (next !== undefined &&
        this.organizerIds !== undefined &&
        next.length === this.organizerIds.length &&
        next.every((id, index) => id === this.organizerIds?.[index]))
    )
      return;
    this.organizerIds = next;
    this.loaded = false;
  }

  async load(force = false): Promise<void> {
    if (this.loaded && !force) return;

    this.loading = true;
    this.error = null;
    const requestVersion = ++this.requestVersion;

    try {
      const items = await this.api.listEvents({
        sortBy: this.sortBy,
        sortOrder: this.sortOrder,
        search: this.search,
        start: this.start,
        end: this.end,
        organizerIds: this.organizerIds,
      });
      runInAction(() => {
        if (requestVersion !== this.requestVersion) return;
        this.items = items;
        this.loaded = true;
      });
    } catch (cause) {
      runInAction(() => {
        if (requestVersion !== this.requestVersion) return;
        this.error = 'Не удалось загрузить события. Попробуйте ещё раз.';
      });
      console.error('EventsStore: request failed', cause);
    } finally {
      runInAction(() => {
        if (requestVersion === this.requestVersion) this.loading = false;
      });
    }
  }
}
