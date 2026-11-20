import { httpApi } from "@/services/api/httpApi";
import { FormsStore } from "./forms.store";
import { AuthStore } from "./auth.store";
import { ThemesStore } from "@/stores/themes.store";
import {OrganizationsStore} from "@/stores/organizations.store";
import {VenuesStore} from "@/stores/venues.store";
import {EventCatalogStore} from "@/stores/event-catalog.store";

export interface Stores {
  auth: AuthStore
  forms: FormsStore
  themes: ThemesStore
  organizations: OrganizationsStore
  venues: VenuesStore
  eventCatalog: EventCatalogStore
}

const api = httpApi

export function createStores(): Stores {
  return {
    auth: new AuthStore(api),
    forms: new FormsStore(api),
    themes: new ThemesStore(api),
    organizations: new OrganizationsStore(api),
    venues: new VenuesStore(api),
    eventCatalog: new EventCatalogStore(api),
  }
}

export const stores = createStores()
