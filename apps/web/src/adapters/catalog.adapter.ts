import z from 'zod';
import {CatalogOption, Organization, Theme} from "@/types/catalog";
import {Venue} from "@/types/venue";
import {Building} from "@/types/building";
import {capitalize} from "@/shared/lib";

export const themeSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
});

export type ThemeContract = z.infer<typeof themeSchema>;

export function themeToDomain(raw: ThemeContract): Theme {
  return { ...raw };
}

export const organizationSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  categoryId: z.uuid(),
});

export type OrganizationContract = z.infer<typeof organizationSchema>;

export function organizationToDomain(raw: OrganizationContract): Organization {
  return { ...raw }
}

export const buildingSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
});

export type BuildingContract = z.infer<typeof buildingSchema>;

export function buildingToDomain(raw: BuildingContract): Building {
  return { ...raw }
}

export const venueSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  building: buildingSchema,
});

export type VenueContract = z.infer<typeof venueSchema>;

export function venueToDomain(raw: VenueContract): Venue {
  return { ...raw }
}

export const catalogOptionSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
});

export type CatalogOptionContract = z.infer<typeof catalogOptionSchema>;

export function catalogOptionToDomain(raw: CatalogOptionContract): CatalogOption {
  return {
    id: raw.id,
    name: capitalize(raw.name),
  };
}
