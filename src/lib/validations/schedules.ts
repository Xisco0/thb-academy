import { z } from 'zod';

export const scheduleSchema = z.object({
  enrollmentId: z.string().uuid().optional().nullable(),
  courseId: z.string().uuid('Please select a course'),
  instructorId: z.string().uuid().optional().nullable(),
  venueId: z.string().uuid().optional().nullable(),
  studentId: z.string().uuid().optional().nullable(),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  status: z.enum(['scheduled', 'completed', 'cancelled', 'rescheduled']).default('scheduled'),
  notes: z.string().optional().nullable(),
}).refine((data) => data.startTime < data.endTime, {
  message: 'End time must be after start time',
  path: ['endTime'],
});

export type ScheduleInput = z.infer<typeof scheduleSchema>;
