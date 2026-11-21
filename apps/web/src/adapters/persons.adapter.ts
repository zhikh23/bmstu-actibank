import z from 'zod';
import {Person} from "@/types/person";

export const personSchema = z.object({
  id: z.uuid(),
  fullName: z.string().min(1),
});

export type PersonContract = z.infer<typeof personSchema>;

export function personToDomain(raw: PersonContract): Person {
  return { ...raw }
}

export const personsListItemSchema = z.object({
  id: z.uuid(),
  fullName: z.string().min(1),
});

export type PersonsListItemContract = z.infer<typeof personsListItemSchema>;

export function personsListItemToDomain(raw: PersonsListItemContract): Person {
  return { ...raw }
}
