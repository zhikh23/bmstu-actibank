import {httpApi} from "@/services/api/httpApi";
import {FormsStore} from "./forms.store";
import {AuthStore} from "./auth.store";
import {ThemesStore} from "@/stores/themes.store";
import {OrganizationsStore} from "@/stores/organizations.store";
import {VenuesStore} from "@/stores/venues.store";
import {EventCatalogStore} from "@/stores/event-catalog.store";
import {RolesStore} from "@/stores/roles.store";
import {StudentsStore} from "@/stores/students.store";
import {StudentStore} from "@/stores/student.store";

export interface Stores {
  auth: AuthStore
  forms: FormsStore
  themes: ThemesStore
  organizations: OrganizationsStore
  venues: VenuesStore
  eventCatalog: EventCatalogStore
  roles: RolesStore
  students: StudentsStore
  student: StudentStore
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
    roles: new RolesStore(api),
    students: new StudentsStore(api),
    student: new StudentStore(api),
  }
}

export const stores = createStores()
