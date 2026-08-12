import { z } from 'zod';

export const eventSchema = z.object({
  title: z.string().min(3).max(150),
  slug: z.string().min(3).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  description: z.string().min(20).optional().nullable(),
  detailedContent: z.string().optional().nullable(),
  bannerUrl: z.string().url().optional().nullable(),
  date: z.string().min(1, 'Event date is required'),
  startTime: z.string().optional().nullable(),
  endTime: z.string().optional().nullable(),
  venueId: z.string().uuid().optional().nullable(),
  venueName: z.string().optional().nullable(),
  venueAddress: z.string().optional().nullable(),
  status: z.enum(['draft', 'published']),
  seoTitle: z.string().max(70).optional().nullable(),
  seoDescription: z.string().max(160).optional().nullable(),
});

export type EventInput = z.infer<typeof eventSchema>;
