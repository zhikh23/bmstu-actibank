export interface EventsListItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  organizers: string[];
  start: Date;
  end: Date;
  createdAt: Date;
}

export type EventsList = EventsListItem[];
