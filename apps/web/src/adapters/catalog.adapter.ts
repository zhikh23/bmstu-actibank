import z from 'zod';

import { capitalize } from '@/shared/lib';
import { Building } from '@/types/building';
import { CatalogOption, Organization, Theme } from '@/types/catalog';
import { Role } from '@/types/role';
import { RoleCategory } from '@/types/role-category';
import { RoleWithCategory } from '@/types/role-with-category';
import { VenueWithBuilding } from '@/types/venue-with-building';

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
  return { ...raw };
}

export const buildingSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
});

export type BuildingContract = z.infer<typeof buildingSchema>;

export function buildingToDomain(raw: BuildingContract): Building {
  return { ...raw };
}

export const venueWithBuildingSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  building: buildingSchema,
});

export type VenueWithBuildingContract = z.infer<typeof venueWithBuildingSchema>;

export function venueWithBuildingToDomain(
  raw: VenueWithBuildingContract,
): VenueWithBuilding {
  return { ...raw };
}

export const catalogOptionSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
});

export type CatalogOptionContract = z.infer<typeof catalogOptionSchema>;

export function catalogOptionToDomain(
  raw: CatalogOptionContract,
): CatalogOption {
  return {
    id: raw.id,
    name: capitalize(raw.name),
  };
}

export const roleCategorySchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
});

export type RoleCategoryContract = z.infer<typeof roleCategorySchema>;

export function roleCategoryToDomain(raw: RoleCategoryContract): RoleCategory {
  return {
    id: raw.id,
    name: raw.name,
  };
}

export const roleWithCategorySchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  category: roleCategorySchema,
});

export type RoleWithCategoryContract = z.infer<typeof roleWithCategorySchema>;

export function roleWithCategoryToDomain(
  raw: RoleWithCategoryContract,
): RoleWithCategory {
  return {
    id: raw.id,
    name: raw.name,
    category: roleCategoryToDomain(raw.category),
  };
}

export const roleSchema = z.object({
  id: z.uuid(),
  categoryId: z.uuid(),
  name: z.string().min(1),
});

export type RoleContract = z.infer<typeof roleSchema>;

export function roleToDomain(raw: RoleContract): Role {
  return {
    id: raw.id,
    categoryId: raw.categoryId,
    name: raw.name,
  };
}
