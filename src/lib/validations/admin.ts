import { z } from 'zod';

export const createAdminSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10).optional(),
  roleId: z.string().uuid('Please select a role'),
});

export const roleSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().optional().nullable(),
  permissions: z.record(z.string(), z.object({
    granted: z.boolean(),
    config: z.object({
      view: z.boolean().optional(),
      add: z.boolean().optional(),
      edit: z.boolean().optional(),
      delete: z.boolean().optional(),
    }).optional(),
  })),
});

export type CreateAdminInput = z.infer<typeof createAdminSchema>;
export type RoleInput = z.infer<typeof roleSchema>;
