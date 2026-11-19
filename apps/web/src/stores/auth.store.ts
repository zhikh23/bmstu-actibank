import { Me } from "@/types/domain";
import { makeAutoObservable, runInAction } from "mobx";
import {isUnauthorized} from "@/shared/auth/unauthorized";

export interface AuthApi {
  getMe(): Promise<Me>
  logout(): Promise<void>
}

export type AuthStatus =
  | 'idle'
  | 'loading'
  | 'authenticated'
  | 'unauthenticated'
  | 'error';

export class AuthStore {
  me: Me | null = null;
  status: AuthStatus = 'idle';
  error: string | null = null;

  private pending: Promise<void> | null = null;

  constructor(private api: AuthApi) {
    makeAutoObservable(this)
  }

  load(force: boolean = false): Promise<void> {
    if (this.pending) return this.pending;
    if (!force && this.status === 'authenticated') return Promise.resolve();
    this.pending = this.doLoad().finally(() => {
      this.pending = null;
    });
    return this.pending;
  }

  async doLoad(): Promise<void> {
    this.status = 'loading';
    this.error = null;
    try {
      const me = await this.api.getMe();
      runInAction(() => {
        this.me = me;
        this.status = 'authenticated';
      });
    } catch (cause) {
      const unauthorized = isUnauthorized(cause);
      runInAction(() => {
        this.me = null;
        if (unauthorized) {
          this.status = 'unauthenticated';
        } else {
          this.status = 'error';
          this.error = cause instanceof Error ? cause.message : String(cause);
        }
      });
      if (unauthorized) {
        console.error('AuthStore: getMe request failed', cause);
      }
    }
  }

  async logout(): Promise<void> {
    try {
      await this.api.logout();
    } catch (cause) {
      console.error('AuthStore: logout failed', cause);
    } finally {
      runInAction(() => {
        this.me = null;
        this.status = 'unauthenticated';
        this.error = null;
      })
    }
  }
}
