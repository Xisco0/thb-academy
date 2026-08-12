import { z } from 'zod';

export const sendNotificationSchema = z.object({
  title: z.string().min(3),
  message: z.string().min(10),
  targetType: z.enum(['all', 'selected', 'course']),
  targetCourseId: z.string().uuid().optional().nullable(),
  recipientIds: z.array(z.string().uuid()).optional().default([]),
}).refine(
  (data) => {
    if (data.targetType === 'course') return !!data.targetCourseId;
    if (data.targetType === 'selected') return data.recipientIds.length > 0;
    return true;
  },
  { message: 'Please select recipients', path: ['recipientIds'] }
);

export type SendNotificationInput = z.infer<typeof sendNotificationSchema>;
