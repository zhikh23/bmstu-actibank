import { httpClient } from './http'
import {
  BuildingContract,
  CatalogOptionContract,
  OrganizationContract,
  ThemeContract,
  VenueContract,
} from "@/adapters/catalog.adapter";

export class CatalogApi {
  constructor(private http = httpClient) { }

  async getThemes(): Promise<ThemeContract[]> {
    const response = await this.http.get<ThemeContract[]>('/api/v1/catalog/themes');
    return response.data;
  }

  async getOrganizations(): Promise<OrganizationContract[]> {
    const response = await this.http.get<OrganizationContract[]>('/api/v1/catalog/organizations');
    return response.data;
  }

  async getBuildings(): Promise<BuildingContract[]> {
    const response = await this.http.get<BuildingContract[]>('/api/v1/catalog/buildings');
    return response.data;
  }

  async getBuildingVenues(buildingId: string): Promise<VenueContract[]> {
    const response = await this.http.get<VenueContract[]>(`/api/v1/catalog/buildings/${buildingId}/venues`);
    return response.data;
  }

  async getLevels(): Promise<CatalogOptionContract[]> {
    const response = await this.http.get<CatalogOptionContract[]>('/api/v1/catalog/levels');
    return response.data;
  }

  async getFormats(): Promise<CatalogOptionContract[]> {
    const response = await this.http.get<CatalogOptionContract[]>('/api/v1/catalog/formats');
    return response.data;
  }

  async getEventTypes(): Promise<CatalogOptionContract[]> {
    const response = await this.http.get<CatalogOptionContract[]>('/api/v1/catalog/event-types');
    return response.data;
  }
}
