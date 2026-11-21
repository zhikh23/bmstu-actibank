import z from 'zod';
import {FormStatus} from "@/types/form-status";
import {FormsListItem} from "@/types/forms-list";
import {FormDraft} from "@/types/form-draft";

const zIsoDateString = (error?: string | undefined) => z.string().min(1, error);

export const formsListItemSchema = z.object({
  id: z.uuid(),
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  start: zIsoDateString(),
  end: zIsoDateString(),
  status: z.enum(['draft', 'pending', 'reviewing', 'review', 'approved', 'rejected', 'canceled']),
  submitterId: z.uuid(),
  createdAt: zIsoDateString(),
})

export type FormsListItemContract = z.infer<typeof formsListItemSchema>;

function mapStatus(s: string): FormStatus {
  return FormStatus.all().includes(s as FormStatus) ? (s as FormStatus) : 'draft';
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
    createdAt: new Date(raw.createdAt)
  }
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
  guests: z.array(z.object({
    userId: z.uuid(),
    rankId: z.uuid()
  })),
  team: z.array(z.object({
    userId: z.uuid(),
    roleId: z.uuid()
  }))
});

export function formDraftToContract(formDraft: FormDraft): CreateFormRequestContract {
  return createFormRequestSchema.parse({
    ...formDraft,
    participants: {
      students: formDraft.participants_students ?? 0,
      employees: formDraft.participants_employees ?? 0,
      others: formDraft.participants_others ?? 0,
    }
  })
}

export type CreateFormRequestContract = z.infer<typeof createFormRequestSchema>;

export const createFormResponseSchema = z.object({
  formId: z.uuid(),
});

export type CreateFormResponseContract = z.infer<typeof createFormResponseSchema>;
