import z from 'zod';
import {Student, StudentSummary} from "@/types/student";

export const studentSchema = z.object({
  id: z.uuid(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  middleName: z.string().optional(),
  fullName: z.string().min(1),
});

export type StudentContract = z.infer<typeof studentSchema>;

export function studentToDomain(raw: StudentContract): Student {
  return { ...raw }
}

export const studentsListItemSchema = z.object({
  id: z.uuid(),
  fullName: z.string().min(1),
});

export type StudentsListItemContract = z.infer<typeof studentsListItemSchema>;

export function studentsListItemToDomain(raw: StudentsListItemContract): StudentSummary {
  return { ...raw }
}
