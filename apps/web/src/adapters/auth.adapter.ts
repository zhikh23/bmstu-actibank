import { Me } from '@/types/domain';
import z from 'zod';

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
