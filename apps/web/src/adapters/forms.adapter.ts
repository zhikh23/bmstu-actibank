import z from 'zod';
import {FormStatus} from "@/types/form-status";
import {FormsListItem} from "@/types/forms-list";

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

export function formsToDomain(raw: FormsListItemContract): FormsListItem {
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
