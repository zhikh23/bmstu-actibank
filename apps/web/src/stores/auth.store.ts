import { Me } from "@/types/domain";
import { makeAutoObservable, runInAction } from "mobx";

export interface AuthApi {
  getMe(): Promise<Me>
  logout(): Promise<void>
}

export class AuthStore {
  me: Me | null = null;
  loading = false;
  error: string | null = null;

  private loaded = false;

  constructor(private api: AuthApi) {
    makeAutoObservable(this)
  }

  async load(force: boolean = false): Promise<void> {
    if (this.loaded && !force) return
    this.loading = true
    this.error = null
    try {
      const me = await this.api.getMe()
      runInAction(() => {
        this.me = me
        this.loaded = true
      })
    } catch (cause) {
      runInAction(() => {
        this.error = String(cause)
      })
      console.error('AuthStore: getMe request failed', cause)
    } finally {
      runInAction(() => {
        this.loading = false
      })
    }
  }

  async logout(): Promise<void> {
    try {
      await this.api.logout();
    } catch (cause) {
      console.error('AuthStore: logout fauled', cause);
    }
  }
}
