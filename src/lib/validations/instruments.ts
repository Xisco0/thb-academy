import { z } from 'zod';

export const instrumentSchema = z.object({
  name: z.string().min(2).max(50),
  slug: z.string().min(2).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  description: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export type InstrumentInput = z.infer<typeof instrumentSchema>;
