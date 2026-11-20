import z from 'zod';
import {Me} from "@/types/user";

export const userRoleSchema = z.enum(['applicant', 'moderator']);

export const meSchema = z.object({
  id: z.uuid(),
  subject: z.string(),
  roles: z.array(userRoleSchema)
})

export type MeContract = z.infer<typeof meSchema>;

export function meToDomain(raw: MeContract): Me {
  return { ...raw }
}
