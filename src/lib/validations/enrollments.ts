import { z } from 'zod';

export const createEnrollmentSchema = z.object({
  courseId: z.string().uuid('Please select a course'),
  instructorId: z.string().uuid().optional().nullable(),
  venueId: z.string().uuid().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export type CreateEnrollmentInput = z.infer<typeof createEnrollmentSchema>;
