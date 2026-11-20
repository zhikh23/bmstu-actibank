import { meToDomain } from "@/adapters/auth.adapter";
import { formsToDomain as formToDomain } from "@/adapters/forms.adapter";
import { AuthApi } from "@/api/AuthApi";
import { FormsApi } from "@/api/FormsApi";
import {CatalogApi} from "@/api/CatalogApi";
import {
  buildingToDomain,
  catalogOptionToDomain,
  organizationToDomain,
  themeToDomain,
  venueToDomain,
} from "@/adapters/catalog.adapter";
import {Building} from "@/types/building";
import {Venue} from "@/types/venue";
import {FormsListItem} from "@/types/forms-list";
import {CatalogOption, Organization, Theme} from "@/types/catalog";
import {Me} from "@/types/user";

const authApi = new AuthApi();
const formsApi = new FormsApi();
const catalogApi = new CatalogApi();

export const httpApi = {
  async getMe(): Promise<Me> {
    const me = await authApi.getMe();
    return meToDomain(me);
  },

  async logout(): Promise<void> {
    await authApi.logout();
  },

  async getFormsList(): Promise<FormsListItem[]> {
    const forms = await formsApi.getFormsList();
    return forms.map(formToDomain);
  },

  async getThemes(): Promise<Theme[]> {
    const themes = await catalogApi.getThemes();
    return themes.map(themeToDomain);
  },

  async getOrganizations(): Promise<Organization[]> {
    const organizations = await catalogApi.getOrganizations();
    return organizations.map(organizationToDomain);
  },

  async getBuildings(): Promise<Building[]> {
    const buildings = await catalogApi.getBuildings();
    return buildings.map(buildingToDomain);
  },

  async getBuildingVenues(buildingId: string): Promise<Venue[]> {
    const venues = await catalogApi.getBuildingVenues(buildingId);
    return venues.map(venueToDomain);
  },

  async getLevels(): Promise<CatalogOption[]> {
    const levels = await catalogApi.getLevels();
    return levels.map(catalogOptionToDomain);
  },

  async getFormats(): Promise<CatalogOption[]> {
    const formats = await catalogApi.getFormats();
    return formats.map(catalogOptionToDomain);
  },

  async getEventTypes(): Promise<CatalogOption[]> {
    const types = await catalogApi.getEventTypes();
    return types.map(catalogOptionToDomain);
  }
}
