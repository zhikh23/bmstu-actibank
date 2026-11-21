import {makeAutoObservable, runInAction} from 'mobx';

import {Student} from '@/types/student';
import {StudentApi} from "@/stores/students.store";

export class StudentStore {
  item: Student | null = null;
  loading = false;
  error: string | null = null;

  private loadedStudentId: string | null = null;

  constructor(private api: StudentApi) {
    makeAutoObservable(this);
  }

  get current(): Student | null {
    return this.item;
  }

  async load(studentId: string, force = false): Promise<void> {
    if (!force && this.loadedStudentId === studentId) return;

    this.loading = true;
    this.error = null;

    try {
      const item = await this.api.getStudent(studentId);
      runInAction(() => {
        this.item = item;
        this.loadedStudentId = studentId;
      });
    } catch (cause) {
      runInAction(() => {
        this.item = null;
        this.error = 'Не удалось загрузить информацию о студенте.';
      });
      console.error('StudentStore: request failed', cause);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  clear(): void {
    this.item = null;
    this.error = null;
    this.loadedStudentId = null;
  }
}
