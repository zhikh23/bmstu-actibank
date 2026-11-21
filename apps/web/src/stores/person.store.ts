import {makeAutoObservable, runInAction} from 'mobx';

import {Person} from '@/types/person';
import {PersonApi} from "@/stores/persons.store";

export class PersonStore {
  item: Person | null = null;
  loading = false;
  error: string | null = null;

  private loadedPersonId: string | null = null;

  constructor(private api: PersonApi) {
    makeAutoObservable(this);
  }

  get current(): Person | null {
    return this.item;
  }

  async load(personId: string, force = false): Promise<void> {
    if (!force && this.loadedPersonId === personId) return;

    this.loading = true;
    this.error = null;

    try {
      const item = await this.api.getPerson(personId);
      runInAction(() => {
        this.item = item;
        this.loadedPersonId = personId;
      });
    } catch (cause) {
      runInAction(() => {
        this.item = null;
        this.error = 'Не удалось загрузить информацию о пользователе.';
      });
      console.error('PersonStore: request failed', cause);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  clear(): void {
    this.item = null;
    this.error = null;
    this.loadedPersonId = null;
  }
}
