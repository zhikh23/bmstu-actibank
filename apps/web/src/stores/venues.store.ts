import {makeAutoObservable, runInAction} from "mobx";
import {Building} from "@/types/building";
import {Venue} from "@/types/venue";

export interface CatalogApi {
  getBuildings(): Promise<Building[]>
  getBuildingVenues(buildingId: string): Promise<Venue[]>
}

export class VenuesStore {
  buildings: Building[] = [];
  venues: Record<string, Venue> = {};
  loadingBuildings = false;
  loadingVenues = false;
  buildingsError: string | null = null;
  venuesError: string | null = null;

  private buildingsLoaded = false;

  constructor(private api: CatalogApi) {
    makeAutoObservable(this);
  }

  buildingVenues(buildingId: string): Venue[] {
    return Object.values(this.venues).filter((venue) => venue.building.id === buildingId);
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
        this.buildingsError = 'Не удалось загрузить здания.';
      });
      console.error('VenuesStore: buildings request failed', cause);
    } finally {
      runInAction(() => {
        this.loadingBuildings = false;
      });
    }
  }

  async loadVenues(buildingId: string): Promise<void> {
    this.loadingVenues = true;
    this.venuesError = null;

    try {
      const venues = await this.api.getBuildingVenues(buildingId);
      runInAction(() => {
        venues.forEach((venue) => {
          this.venues[venue.id] = venue;
        })
      });
    } catch (cause) {
      runInAction(() => {
        this.venuesError = 'Не удалось загрузить места проведения.';
      });
      console.error('VenuesStore: venues request failed', cause);
    } finally {
      runInAction(() => {
        this.loadingVenues = false;
      });
    }
  }
}
