import { z } from 'zod';

export const websiteSettingsSchema = z.object({
  academyName: z.string().min(1),
  academyShortName: z.string().min(1),
  tagline: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  businessHours: z.string().optional().nullable(),
  facebookUrl: z.string().url().optional().nullable().or(z.literal('')),
  instagramUrl: z.string().url().optional().nullable().or(z.literal('')),
  youtubeUrl: z.string().url().optional().nullable().or(z.literal('')),
  tiktokUrl: z.string().url().optional().nullable().or(z.literal('')),
  twitterUrl: z.string().url().optional().nullable().or(z.literal('')),
  bankName: z.string().optional().nullable(),
  bankAccountNumber: z.string().optional().nullable(),
  bankAccountName: z.string().optional().nullable(),
  defaultSeoTitle: z.string().max(70).optional().nullable(),
  defaultSeoDescription: z.string().max(160).optional().nullable(),
});

export const websiteContentSchema = z.object({
  sectionKey: z.string().min(1),
  title: z.string().optional().nullable(),
  subtitle: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  ctaText: z.string().optional().nullable(),
  ctaUrl: z.string().optional().nullable(),
  metadata: z.record(z.string(), z.any()).optional().default({}),
  isActive: z.boolean().default(true),
});

export type WebsiteSettingsInput = z.infer<typeof websiteSettingsSchema>;
export type WebsiteContentInput = z.infer<typeof websiteContentSchema>;
