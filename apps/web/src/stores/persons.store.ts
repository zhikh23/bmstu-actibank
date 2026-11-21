import {makeAutoObservable, runInAction} from 'mobx';

import {Person} from '@/types/person';

export interface PersonsApi {
  getPersons(): Promise<Person[]>;
}

export interface PersonApi {
  getPerson(personId: string): Promise<Person>;
}

export class PersonsStore {
  items: Person[] = [];
  loading = false;
  error: string | null = null;
  searchQuery = '';

  private loaded = false;

  constructor(private api: PersonsApi) {
    makeAutoObservable(this);
  }

  get filtered(): Person[] {
    const query = this.searchQuery.trim().toLocaleLowerCase();
    if (!query) return this.items;

    return this.items.filter((person) =>
      person.fullName.toLocaleLowerCase().includes(query),
    );
  }

  setSearchQuery(query: string): void {
    this.searchQuery = query;
  }

  getById(personId: string): Person | undefined {
    return this.items.find((person) => person.id === personId);
  }

  async load(force = false): Promise<void> {
    if (this.loaded && !force) return;

    this.loading = true;
    this.error = null;

    try {
      const items = await this.api.getPersons();
      runInAction(() => {
        this.items = items;
        this.loaded = true;
      });
    } catch (cause) {
      runInAction(() => {
        this.error = 'Не удалось загрузить людей. Попробуйте ещё раз.';
      });
      console.error('PersonsStore: request failed', cause);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}
