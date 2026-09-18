import type { MetadataRoute } from 'next';

export const revalidate = 86400;

export default function robots(): MetadataRoute.Robots {
  const siteUrl = 'https://www.thbacademy.org';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/student/',
          '/api/',
          '/login',
          '/register',
          '/forgot-password',
          '/reset-password',
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
