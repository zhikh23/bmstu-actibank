import {makeAutoObservable, runInAction} from 'mobx'
import {FormsListItem} from "@/types/forms-list";
import {FormDraft} from "@/types/form-draft";

export interface FormsApi {
  getFormsList(): Promise<FormsListItem[]>
  createForm(draft: FormDraft): Promise<string>
}

export class FormsStore {
  items: FormsListItem[] = []
  loading = false
  error: string | null = null
  searchQuery = ''
  submitting = false
  submitError: string | null = null

  private loaded = false

  constructor(private api: FormsApi) {
    makeAutoObservable(this)
  }

  get filtered(): FormsListItem[] {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) return this.items;
    return this.items.filter((f) => f.name.toLowerCase().includes(query));
  }

  setSearchQuery(q: string): void {
    this.searchQuery = q
  }

  async create(draft: FormDraft): Promise<string | null> {
    this.submitting = true
    this.submitError = null
    try {
      const formId = await this.api.createForm(draft)
      this.loaded = false
      return formId
    } catch (cause) {
      runInAction(() => {
        this.submitError = 'Не удалось создать форму. Проверьте данные и попробуйте ещё раз.'
      })
      console.error('FormsStore: create failed', cause)
      return null
    } finally {
      runInAction(() => {
        this.submitting = false
      })
    }
  }

  async load(force: boolean = false): Promise<void> {
    if (this.loaded && !force) return
    this.loading = true;
    this.error = null;
    try {
      const items = await this.api.getFormsList()
      runInAction(() => {
        this.items = items
        this.loaded = true
      })
    } catch (cause) {
      runInAction(() => {
        this.error = 'Не удалось загрузить заявки. Попробуйте ещё раз.'
      })
      console.error('FormsStore: request failed', cause)
    } finally {
      runInAction(() => {
        this.loading = false
      })
    }
  }
}
