import { httpApi } from '@/services/api/httpApi';
import { SelectedRolesStore } from '@/stores/selected-roles.store';

import { AuthStore } from './auth.store';
import { EventCatalogStore } from './event-catalog.store';
import { FormsStore } from './forms.store';
import { OrganizationsStore } from './organizations.store';
import { RolesCatalogStore } from './roles-catalog.store';
import { SelectedVenuesStore } from './selected-venues.store';
import { StudentStore } from './student.store';
import { StudentsStore } from './students.store';
import { ThemesStore } from './themes.store';
import { VenueCatalogStore } from './venue-catalog.store';

export interface Stores {
  auth: AuthStore;
  forms: FormsStore;
  themes: ThemesStore;
  organizations: OrganizationsStore;
  eventCatalog: EventCatalogStore;
  roles: RolesCatalogStore;
  students: StudentsStore;
  student: StudentStore;
  venues: VenueCatalogStore;
  selectedVenues: SelectedVenuesStore;
  selectedRoles: SelectedRolesStore;
}

const api = httpApi;

export function createStores(): Stores {
  return {
    auth: new AuthStore(api),
    forms: new FormsStore(api),
    themes: new ThemesStore(api),
    organizations: new OrganizationsStore(api),
    eventCatalog: new EventCatalogStore(api),
    roles: new RolesCatalogStore(api),
    students: new StudentsStore(api),
    student: new StudentStore(api),
    venues: new VenueCatalogStore(api),
    selectedVenues: new SelectedVenuesStore(api),
    selectedRoles: new SelectedRolesStore(api),
  };
}

export const stores = createStores();
