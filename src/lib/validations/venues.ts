import { z } from 'zod';

export const venueSchema = z.object({
  name: z.string().min(2),
  address: z.string().min(5),
  city: z.string().default('Lagos'),
  state: z.string().default('Lagos'),
  country: z.string().default('Nigeria'),
  description: z.string().optional().nullable(),
  capacity: z.number().int().positive().optional().nullable(),
  isActive: z.boolean().default(true),
  isDefault: z.boolean().default(false),
});

export type VenueInput = z.infer<typeof venueSchema>;
