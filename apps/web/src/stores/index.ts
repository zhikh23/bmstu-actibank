import { httpApi } from "@/services/api/httpApi";
import { FormsStore } from "./forms.store";
import { AuthStore } from "./auth.store";

export interface Stores {
  auth: AuthStore
  forms: FormsStore
}

const api = httpApi

export function createStores(): Stores {
  return {
    auth: new AuthStore(api),
    forms: new FormsStore(api),
  }
}

export const stores = createStores()
