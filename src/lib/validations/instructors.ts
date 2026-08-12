import { z } from 'zod';

export const instructorSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email().optional().nullable(),
  phone: z.string().min(10).optional().nullable(),
  bio: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  specializations: z.array(z.string()).optional().default([]),
  isActive: z.boolean().default(true),
});

export type InstructorInput = z.infer<typeof instructorSchema>;
