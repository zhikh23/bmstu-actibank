import { makeAutoObservable, runInAction } from 'mobx';

import { FormDetail } from '@/types/form-detail';
import { FormDraft } from '@/types/form-draft';
import { FormsListItem } from '@/types/forms-list';

export interface FormsApi {
  getFormsList(): Promise<FormsListItem[]>;
  createForm(draft: FormDraft): Promise<string>;
  getForm(id: string): Promise<FormDetail>;
  updateForm(id: string, draft: FormDraft): Promise<FormDetail>;
  generateFormDocument(id: string): Promise<string>;
  attachFormDocument(id: string, fileId: string): Promise<void>;
  uploadFile(file: File): Promise<string>;
  markFormReady(id: string): Promise<void>;
  convertFormToDraft(id: string, reason: string | null): Promise<void>;
  cancelForm(id: string): Promise<void>;
  startFormReview(id: string): Promise<void>;
  approveForm(id: string): Promise<void>;
  rejectForm(id: string, reason: string | null): Promise<void>;
}

export class FormsStore {
  items: FormsListItem[] = [];
  loading = false;
  error: string | null = null;
  searchQuery = '';
  submitting = false;
  submitError: string | null = null;
  selected: FormDetail | null = null;
  loadingSelected = false;
  selectedError: string | null = null;
  actionLoading = false;
  actionError: string | null = null;

  private loaded = false;

  constructor(private api: FormsApi) {
    makeAutoObservable(this);
  }

  get filtered(): FormsListItem[] {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) return this.items;
    return this.items.filter((f) => f.name.toLowerCase().includes(query));
  }

  setSearchQuery(q: string): void {
    this.searchQuery = q;
  }

  async create(draft: FormDraft): Promise<string | null> {
    this.submitting = true;
    this.submitError = null;
    try {
      const formId = await this.api.createForm(draft);
      this.loaded = false;
      return formId;
    } catch (cause) {
      runInAction(() => {
        this.submitError =
          'Не удалось создать форму. Проверьте данные и попробуйте ещё раз.';
      });
      console.error('FormsStore: create failed', cause);
      return null;
    } finally {
      runInAction(() => {
        this.submitting = false;
      });
    }
  }

  async loadSelected(id: string, force: boolean = false): Promise<void> {
    if (!force && this.selected?.id === id) return;
    this.loadingSelected = true;
    this.selectedError = null;
    try {
      const selected = await this.api.getForm(id);
      runInAction(() => {
        this.selected = selected;
      });
    } catch (cause) {
      runInAction(() => {
        this.selectedError = 'Не удалось загрузить заявку.';
      });
      console.error('FormsStore: getForm failed', cause);
    } finally {
      runInAction(() => {
        this.loadingSelected = false;
      });
    }
  }

  async update(id: string, draft: FormDraft): Promise<boolean> {
    this.submitting = true;
    this.submitError = null;
    try {
      const selected = await this.api.updateForm(id, draft);
      runInAction(() => {
        this.selected = selected;
        this.loaded = false;
      });
      return true;
    } catch (cause) {
      runInAction(() => {
        this.submitError = 'Не удалось сохранить изменения.';
      });
      console.error('FormsStore: update failed', cause);
      return false;
    } finally {
      runInAction(() => {
        this.submitting = false;
      });
    }
  }

  async generateDocument(id: string): Promise<string | null> {
    this.actionError = null;
    try {
      return await this.api.generateFormDocument(id);
    } catch (cause) {
      runInAction(() => {
        this.actionError =
          'Не удалось сгенерировать печатную форму. Попробуйте ещё раз.';
      });
      console.error('FormsStore: generate document failed', cause);
      return null;
    }
  }

  async uploadScan(id: string, file: File): Promise<boolean> {
    return this.performAction(async () => {
      const fileId = await this.api.uploadFile(file);
      await this.api.attachFormDocument(id, fileId);
      const selected = await this.api.getForm(id);
      runInAction(() => {
        this.selected = selected;
      });
    });
  }

  private async performAction(action: () => Promise<void>): Promise<boolean> {
    this.actionLoading = true;
    this.actionError = null;
    try {
      await action();
      this.loaded = false;
      return true;
    } catch (cause) {
      runInAction(() => {
        this.actionError = 'Не удалось выполнить действие.';
      });
      console.error('FormsStore: action failed', cause);
      return false;
    } finally {
      runInAction(() => {
        this.actionLoading = false;
      });
    }
  }

  markReady(id: string) {
    return this.performAction(() => this.api.markFormReady(id));
  }

  convertToDraft(id: string) {
    return this.performAction(() => this.api.convertFormToDraft(id, null));
  }

  convertToDraftModerator(id: string, reason: string) {
    return this.performAction(() => this.api.convertFormToDraft(id, reason));
  }

  cancel(id: string) {
    return this.performAction(() => this.api.cancelForm(id));
  }

  startReview(id: string) {
    return this.performAction(() => this.api.startFormReview(id));
  }

  approve(id: string) {
    return this.performAction(() => this.api.approveForm(id));
  }

  reject(id: string, reason: string | null) {
    return this.performAction(() => this.api.rejectForm(id, reason));
  }

  async load(force: boolean = false): Promise<void> {
    if (this.loaded && !force) return;
    this.loading = true;
    this.error = null;
    try {
      const items = await this.api.getFormsList();
      runInAction(() => {
        this.items = items;
        this.loaded = true;
      });
    } catch (cause) {
      runInAction(() => {
        this.error = 'Не удалось загрузить заявки. Попробуйте ещё раз.';
      });
      console.error('FormsStore: request failed', cause);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}
