import z from 'zod';
import { EventsListItem } from '@/types/events-list';

const zIsoDateString = (error?: string | undefined) => z.string().min(1, error);

export const eventsListItemSchema = z.object({
  id: z.uuid(),
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  organizers: z.array(z.uuid()),
  start: zIsoDateString(),
  end: zIsoDateString(),
  createdAt: zIsoDateString(),
});

export type EventsListItemContract = z.infer<typeof eventsListItemSchema>;

export function eventsListItemToDomain(raw: EventsListItemContract): EventsListItem {
  return {
    ...raw,
    start: new Date(raw.start),
    end: new Date(raw.end),
    createdAt: new Date(raw.createdAt),
  };
}
