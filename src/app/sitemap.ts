import type { MetadataRoute } from 'next';
import { getAllCourseEntriesForSitemap, getAllEventEntriesForSitemap } from '@/lib/queries/public';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = 'https://www.thbacademy.org';

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/programs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/events`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/stage-performances`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  const courseEntries = await getAllCourseEntriesForSitemap();
  const coursePages: MetadataRoute.Sitemap = courseEntries.map((course) => ({
    url: `${siteUrl}/programs/${course.slug}`,
    lastModified: course.updated_at ? new Date(course.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  const eventEntries = await getAllEventEntriesForSitemap();
  const eventPages: MetadataRoute.Sitemap = eventEntries.map((event) => ({
    url: `${siteUrl}/events/${event.slug}`,
    lastModified: event.updated_at ? new Date(event.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }));

  return [...staticPages, ...coursePages, ...eventPages];
}
