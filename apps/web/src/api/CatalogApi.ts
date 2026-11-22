import {
  BuildingContract,
  CatalogOptionContract,
  OrganizationContract,
  RoleCategoryContract,
  RoleContract,
  RoleWithCategoryContract,
  ThemeContract,
  VenueWithBuildingContract,
} from '@/adapters/catalog.adapter';

import { httpClient } from './http';

export class CatalogApi {
  constructor(private http = httpClient) {}

  async getThemes(): Promise<ThemeContract[]> {
    const response = await this.http.get<ThemeContract[]>(
      '/api/v1/catalog/themes',
    );
    return response.data;
  }

  async getOrganizations(): Promise<OrganizationContract[]> {
    const response = await this.http.get<OrganizationContract[]>(
      '/api/v1/catalog/organizations',
    );
    return response.data;
  }

  async getBuildings(): Promise<BuildingContract[]> {
    const response = await this.http.get<BuildingContract[]>(
      '/api/v1/catalog/buildings',
    );
    return response.data;
  }

  async getBuildingVenues(
    buildingId: string,
  ): Promise<VenueWithBuildingContract[]> {
    const response = await this.http.get<VenueWithBuildingContract[]>(
      `/api/v1/catalog/buildings/${buildingId}/venues`,
    );
    return response.data;
  }

  async getLevels(): Promise<CatalogOptionContract[]> {
    const response = await this.http.get<CatalogOptionContract[]>(
      '/api/v1/catalog/levels',
    );
    return response.data;
  }

  async getFormats(): Promise<CatalogOptionContract[]> {
    const response = await this.http.get<CatalogOptionContract[]>(
      '/api/v1/catalog/formats',
    );
    return response.data;
  }

  async getEventTypes(): Promise<CatalogOptionContract[]> {
    const response = await this.http.get<CatalogOptionContract[]>(
      '/api/v1/catalog/event-types',
    );
    return response.data;
  }

  async getRoleCategories(): Promise<RoleCategoryContract[]> {
    const response = await this.http.get<RoleCategoryContract[]>(
      '/api/v1/catalog/role-categories',
    );
    return response.data;
  }

  async getCategoryRoles(categoryId: string): Promise<RoleContract[]> {
    const response = await this.http.get<RoleContract[]>(
      `/api/v1/catalog/role-categories/${categoryId}/roles`,
    );
    return response.data;
  }

  async resolveVenues(ids: string[]): Promise<VenueWithBuildingContract[]> {
    const response = await this.http.post<VenueWithBuildingContract[]>(
      '/api/v1/catalog/venues/resolve',
      { ids },
    );
    return response.data;
  }

  async resolveRoles(ids: string[]): Promise<RoleWithCategoryContract[]> {
    const response = await this.http.post<RoleWithCategoryContract[]>(
      '/api/v1/catalog/roles/resolve',
      { ids },
    );
    return response.data;
  }
}
