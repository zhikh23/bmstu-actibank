import z from 'zod';

import { FormDetail } from '@/types/form-detail';
import { FormDraft } from '@/types/form-draft';
import { FormStatus } from '@/types/form-status';
import { FormsListItem } from '@/types/forms-list';

const zIsoDateString = (error?: string | undefined) => z.string().min(1, error);

export const formsListItemSchema = z.object({
  id: z.uuid(),
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  start: zIsoDateString(),
  end: zIsoDateString(),
  status: z.enum([
    'draft',
    'pending',
    'reviewing',
    'review',
    'approved',
    'rejected',
    'canceled',
  ]),
  submitterId: z.uuid(),
  createdAt: zIsoDateString(),
});

export type FormsListItemContract = z.infer<typeof formsListItemSchema>;

function mapStatus(s: string): FormStatus {
  return FormStatus.all().includes(s as FormStatus)
    ? (s as FormStatus)
    : 'draft';
}

export function formToDomain(raw: FormsListItemContract): FormsListItem {
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    description: raw.description,
    start: new Date(raw.start),
    end: new Date(raw.end),
    status: mapStatus(raw.status),
    submitterId: raw.submitterId,
    createdAt: new Date(raw.createdAt),
  };
}

export const createFormRequestSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  organizers: z.array(z.uuid()),
  links: z.array(z.url()),
  venues: z.array(z.uuid()),
  themes: z.array(z.uuid()),
  start: zIsoDateString(),
  end: zIsoDateString(),
  formatId: z.uuid(),
  typeId: z.uuid(),
  levelId: z.uuid(),
  participants: z.object({
    students: z.number().int().min(0),
    employees: z.number().int().min(0),
    others: z.number().int().min(0),
  }),
  guests: z.array(
    z.object({
      userId: z.uuid(),
      rankId: z.uuid(),
    }),
  ),
  team: z.array(
    z.object({
      userId: z.uuid(),
      roleId: z.uuid(),
    }),
  ),
});

export function formDraftToContract(
  formDraft: FormDraft,
): CreateFormRequestContract {
  return createFormRequestSchema.parse({
    ...formDraft,
    start: formDraft.start?.toISOString().replace('Z', '') || null,
    end: formDraft.end?.toISOString().replace('Z', '') || null,
    participants: {
      students: formDraft.participants_students ?? 0,
      employees: formDraft.participants_employees ?? 0,
      others: formDraft.participants_others ?? 0,
    },
  });
}

export type CreateFormRequestContract = z.infer<typeof createFormRequestSchema>;

export const createFormResponseSchema = z.object({
  formId: z.uuid(),
});

export type CreateFormResponseContract = z.infer<
  typeof createFormResponseSchema
>;

const catalogItemSchema = z.object({ id: z.string(), name: z.string() });

export const formDetailSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  organizers: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      category: catalogItemSchema,
    }),
  ),
  links: z.array(z.string()),
  venues: z.array(
    z.object({ id: z.string(), name: z.string(), building: catalogItemSchema }),
  ),
  themes: z.array(catalogItemSchema),
  start: zIsoDateString(),
  end: zIsoDateString(),
  format: catalogItemSchema,
  type: catalogItemSchema,
  level: catalogItemSchema,
  participants: z.object({
    students: z.number(),
    employees: z.number(),
    others: z.number(),
  }),
  guests: z.array(z.object({ userId: z.string(), rank: catalogItemSchema })),
  team: z.array(
    z.object({
      userId: z.string(),
      role: z.object({
        id: z.string(),
        name: z.string(),
        category: catalogItemSchema,
      }),
    }),
  ),
  status: z.enum([
    'draft',
    'pending',
    'reviewing',
    'approved',
    'rejected',
    'canceled',
  ]),
  reason: z.string().nullable(),
  submitterId: z.string(),
  reviewerId: z.string().nullable(),
  document: z
    .object({
      id: z.string(),
      generatedId: z.string(),
      scanId: z.string().nullable(),
      createdAt: zIsoDateString(),
      uploadedAt: zIsoDateString().nullable(),
    })
    .nullable(),
  createdAt: zIsoDateString(),
  updatedAt: zIsoDateString(),
  reviewedAt: zIsoDateString().nullable(),
  canceledAt: zIsoDateString().nullable(),
});

export type FormDetailContract = z.infer<typeof formDetailSchema>;

export function formDetailToDomain(raw: FormDetailContract): FormDetail {
  return {
    ...raw,
    status: mapStatus(raw.status),
    start: new Date(raw.start),
    end: new Date(raw.end),
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
    reviewedAt: raw.reviewedAt ? new Date(raw.reviewedAt) : null,
    canceledAt: raw.canceledAt ? new Date(raw.canceledAt) : null,
    document: raw.document
      ? {
          ...raw.document,
          createdAt: new Date(raw.document.createdAt),
          uploadedAt: raw.document.uploadedAt
            ? new Date(raw.document.uploadedAt)
            : null,
        }
      : null,
  };
}
