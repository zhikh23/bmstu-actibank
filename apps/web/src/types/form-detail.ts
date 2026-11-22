import type { FormStatus } from '@/types/form-status';

export interface FormCatalogItem {
  id: string;
  name: string;
}

export interface FormVenue {
  id: string;
  name: string;
  building: FormCatalogItem;
}

export interface FormOrganization extends FormCatalogItem {
  category: FormCatalogItem;
}

export interface FormGuest {
  userId: string;
  rank: FormCatalogItem;
}

export interface FormMember {
  userId: string;
  role: FormCatalogItem & { category: FormCatalogItem };
}

export interface FormDocument {
  id: string;
  generatedId: string;
  scanId: string | null;
  createdAt: Date;
  uploadedAt: Date | null;
}

export interface FormDetail {
  id: string;
  slug: string;
  name: string;
  description: string;
  organizers: FormOrganization[];
  links: string[];
  venues: FormVenue[];
  themes: FormCatalogItem[];
  start: Date;
  end: Date;
  format: FormCatalogItem;
  type: FormCatalogItem;
  level: FormCatalogItem;
  participants: { students: number; employees: number; others: number };
  guests: FormGuest[];
  team: FormMember[];
  status: FormStatus;
  reason: string | null;
  submitterId: string;
  reviewerId: string | null;
  document: FormDocument | null;
  createdAt: Date;
  updatedAt: Date;
  reviewedAt: Date | null;
  canceledAt: Date | null;
}
