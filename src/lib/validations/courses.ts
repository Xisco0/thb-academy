import { z } from 'zod';

export const courseFaqSchema = z.object({
  question: z.string().min(5, 'Question must be at least 5 characters'),
  answer: z.string().min(10, 'Answer must be at least 10 characters'),
});

export const courseSchema = z.object({
  name: z.string().min(3, 'Course name must be at least 3 characters').max(100),
  slug: z.string().min(3).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Invalid slug format'),
  instrumentId: z.string().uuid('Please select an instrument'),
  instructorId: z.string().uuid().optional().nullable(),
  description: z.string().min(20).optional().nullable(),
  detailedContent: z.string().optional().nullable(),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'all_levels']),
  duration: z.string().optional().nullable(),
  price: z.number().min(0, 'Price must be positive'),
  currency: z.string().default('NGN'),
  imageUrl: z.string().url().optional().nullable(),
  whoCanJoin: z.string().optional().nullable(),
  whatYouLearn: z.string().optional().nullable(),
  faqs: z.array(courseFaqSchema).optional().default([]),
  scheduleInfo: z.string().optional().nullable(),
  status: z.enum(['draft', 'published', 'archived']),
  seoTitle: z.string().max(70).optional().nullable(),
  seoDescription: z.string().max(160).optional().nullable(),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

export type CourseInput = z.infer<typeof courseSchema>;
export type CourseFaqInput = z.infer<typeof courseFaqSchema>;
