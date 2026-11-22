import { makeAutoObservable, runInAction } from 'mobx';

import { Student, StudentSummary } from '@/types/student';

export interface StudentsApi {
  getStudents(): Promise<StudentSummary[]>;
}

export interface StudentApi {
  getStudent(studentId: string): Promise<Student>;
}

export class StudentsStore {
  items: StudentSummary[] = [];
  loading = false;
  error: string | null = null;

  private loaded = false;

  constructor(private api: StudentsApi) {
    makeAutoObservable(this);
  }

  getById(studentId: string): StudentSummary | undefined {
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
