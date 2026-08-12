import { z } from 'zod';

export const studentProfileSchema = z.object({
  dateOfBirth: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  emergencyContactName: z.string().optional().nullable(),
  emergencyContactPhone: z.string().optional().nullable(),
  musicalExperience: z.string().optional().nullable(),
});

export type StudentProfileInput = z.infer<typeof studentProfileSchema>;
