import { makeAutoObservable, runInAction } from 'mobx';

import { Building } from '@/types/building';
import { VenueWithBuilding } from '@/types/venue-with-building';

export interface VenuesApi {
  getBuildings(): Promise<Building[]>;
  getBuildingVenues(buildingId: string): Promise<VenueWithBuilding[]>;
}

export class VenueCatalogStore {
  buildings: Building[] = [];
  venuesByBuilding: Map<string, VenueWithBuilding[]> = new Map();
  loadingBuildings: boolean = false;
  loadingVenues: Set<string> = new Set();
  buildingsError: string | null = null;
  venuesError: Map<string, string | null> = new Map();

  private buildingsLoaded = false;

  constructor(private api: VenuesApi) {
    makeAutoObservable(this);
  }

  buildingVenues(buildingId: string): VenueWithBuilding[] {
    return this.venuesByBuilding.get(buildingId) ?? [];
  }

  isLoadingVenues(buildingId: string) {
    return this.loadingVenues.has(buildingId);
  }

  async loadBuildings(force = false): Promise<void> {
    if (this.buildingsLoaded && !force) return;

    this.loadingBuildings = true;
    this.buildingsError = null;

    try {
      const buildings = await this.api.getBuildings();
      runInAction(() => {
        this.buildings = buildings;
        this.buildingsLoaded = true;
      });
    } catch (cause) {
      runInAction(() => {
        this.buildingsError =
          cause instanceof Error ? cause.message : String(cause);
      });
      console.error('VenuesStore: buildings request failed', cause);
    } finally {
      runInAction(() => {
        this.loadingBuildings = false;
      });
    }
  }

  async loadVenues(buildingId: string): Promise<void> {
    this.loadingVenues.add(buildingId);
    this.venuesError.set(buildingId, null);

    try {
      const venues = await this.api.getBuildingVenues(buildingId);
      runInAction(() => {
        this.venuesByBuilding.set(buildingId, venues);
      });
    } catch (cause) {
      runInAction(() => {
        this.venuesError.set(
          buildingId,
          cause instanceof Error ? cause.message : String(cause),
        );
      });
      console.error('VenuesStore: venues request failed', cause);
    } finally {
      runInAction(() => {
        this.loadingVenues.delete(buildingId);
      });
    }
  }
}
