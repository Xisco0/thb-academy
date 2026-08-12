import type { Course, Event, WebsiteSettings } from '@/types/database.types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// ==========================================
// JSON-LD Structured Data
// ==========================================

export function organizationSchema(settings: WebsiteSettings | null) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MusicSchool',
    name: settings?.academy_name || 'Triumphant Harmony Brass',
    alternateName: settings?.academy_short_name || 'THB',
    description:
      settings?.tagline || 'The sound of victory, The heart of harmony.',
    url: SITE_URL,
    logo: settings?.logo_url || `${SITE_URL}/logo.png`,
    telephone: settings?.phone || undefined,
    email: settings?.email || undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings?.address || undefined,
      addressLocality: settings?.city || 'Lagos',
      addressRegion: settings?.state || 'Lagos',
      addressCountry: settings?.country || 'NG',
    },
    sameAs: [
      settings?.facebook_url,
      settings?.instagram_url,
      settings?.youtube_url,
      settings?.tiktok_url,
      settings?.twitter_url,
    ].filter(Boolean),
  };
}

export function courseSchema(course: Course, settings: WebsiteSettings | null) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    description: course.description || course.name,
    provider: {
      '@type': 'MusicSchool',
      name: settings?.academy_name || 'Triumphant Harmony Brass',
      url: SITE_URL,
    },
    url: `${SITE_URL}/programs/${course.slug}`,
    courseMode: 'In-person',
    educationalLevel: course.level === 'all_levels' ? 'Beginner to Advanced' : course.level,
    offers: {
      '@type': 'Offer',
      price: course.price,
      priceCurrency: course.currency || 'NGN',
      availability: 'https://schema.org/InStock',
    },
    image: course.image_url || undefined,
  };
}

export function eventSchema(event: Event, settings: WebsiteSettings | null) {
  const startDate = event.start_time
    ? `${event.date}T${event.start_time}`
    : event.date;
  const endDate = event.end_time
    ? `${event.date}T${event.end_time}`
    : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'MusicEvent',
    name: event.title,
    description: event.description || event.title,
    startDate,
    endDate,
    url: `${SITE_URL}/events/${event.slug}`,
    image: event.banner_url || undefined,
    location: {
      '@type': 'Place',
      name: event.venue_name || settings?.academy_name || 'Triumphant Harmony Brass',
      address: {
        '@type': 'PostalAddress',
        streetAddress: event.venue_address || settings?.address || undefined,
        addressLocality: settings?.city || 'Lagos',
        addressCountry: 'NG',
      },
    },
    organizer: {
      '@type': 'MusicSchool',
      name: settings?.academy_name || 'Triumphant Harmony Brass',
      url: SITE_URL,
    },
    eventStatus: new Date(event.date) >= new Date()
      ? 'https://schema.org/EventScheduled'
      : 'https://schema.org/EventMovedOnline',
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

// ==========================================
// JSON-LD Component Helper
// ==========================================

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
