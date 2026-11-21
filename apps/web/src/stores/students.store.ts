import {makeAutoObservable, runInAction} from 'mobx';

import {Student} from '@/types/student';

export interface StudentsApi {
  getStudents(): Promise<Student[]>;
}

export interface StudentApi {
  getStudent(studentId: string): Promise<Student>;
}

export class StudentsStore {
  items: Student[] = [];
  loading = false;
  error: string | null = null;
  searchQuery = '';

  private loaded = false;

  constructor(private api: StudentsApi) {
    makeAutoObservable(this);
  }

  get filtered(): Student[] {
    const query = this.searchQuery.trim().toLocaleLowerCase();
    if (!query) return this.items;

    return this.items.filter((student) =>
      student.fullName.toLocaleLowerCase().includes(query),
    );
  }

  setSearchQuery(query: string): void {
    this.searchQuery = query;
  }

  getById(studentId: string): Student | undefined {
    return this.items.find((student) => student.id === studentId);
  }

  async load(force = false): Promise<void> {
    if (this.loaded && !force) return;

    this.loading = true;
    this.error = null;

    try {
      const items = await this.api.getStudents();
      runInAction(() => {
        this.items = items;
        this.loaded = true;
      });
    } catch (cause) {
      runInAction(() => {
        this.error = 'Не удалось загрузить студентов. Попробуйте ещё раз.';
      });
      console.error('StudentsStore: request failed', cause);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}
