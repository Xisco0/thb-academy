import type { Course, Event, WebsiteSettings } from '@/types/database.types';

const SITE_URL = 'https://www.thbacademy.org';

function toAbsoluteUrl(url: string | null | undefined): string | undefined {
  if (!url || !url.trim()) return undefined;
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `${SITE_URL}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`;
}

// ==========================================
// JSON-LD Structured Data Generators
// ==========================================

export function organizationSchema(settings: WebsiteSettings | null) {
  const logoUrl = toAbsoluteUrl(settings?.logo_url) || `${SITE_URL}/images/logo.png`;
  const heroImage = `${SITE_URL}/images/image.png`;

  return {
    '@context': 'https://schema.org',
    '@type': ['EducationalOrganization', 'MusicSchool'],
    name: settings?.academy_name || 'Triumphant Harmony Brass',
    alternateName: settings?.academy_short_name || 'THB Academy',
    description:
      settings?.tagline || 'Premier music academy and live music performance provider in Lagos, Nigeria. Professional training in trumpet, saxophone, keyboard, guitar, violin, drums, and voice.',
    url: SITE_URL,
    logo: logoUrl,
    image: heroImage,
    telephone: settings?.phone || '+234 703 859 5356',
    email: settings?.email || 'info@thbacademy.org',
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings?.address || 'Lagos, Nigeria',
      addressLocality: settings?.city || 'Lagos',
      addressRegion: settings?.state || 'Lagos State',
      addressCountry: settings?.country || 'NG',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '6.5244',
      longitude: '3.3792',
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
  const courseImage = toAbsoluteUrl(course.image_url) || `${SITE_URL}/images/image.png`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    description: course.description || course.name,
    provider: {
      '@type': 'MusicSchool',
      name: settings?.academy_name || 'Triumphant Harmony Brass Music Academy',
      url: SITE_URL,
    },
    url: `${SITE_URL}/programs/${course.slug}`,
    courseMode: 'In-person',
    educationalLevel: course.level === 'all_levels' ? 'Beginner to Advanced' : course.level,
    offers: {
      '@type': 'Offer',
      price: course.price || '0',
      priceCurrency: course.currency || 'NGN',
      availability: 'https://schema.org/InStock',
    },
    image: courseImage,
  };
}

export function eventSchema(event: Event, settings: WebsiteSettings | null) {
  const startDate = event.start_time
    ? `${event.date}T${event.start_time}`
    : event.date;
  const endDate = event.end_time
    ? `${event.date}T${event.end_time}`
    : undefined;

  const eventImage = toAbsoluteUrl(event.banner_url) || `${SITE_URL}/images/image.png`;

  return {
    '@context': 'https://schema.org',
    '@type': 'MusicEvent',
    name: event.title,
    description: event.description || event.title,
    startDate,
    endDate,
    url: `${SITE_URL}/events/${event.slug}`,
    image: eventImage,
    location: {
      '@type': 'Place',
      name: event.venue_name || settings?.academy_name || 'Triumphant Harmony Brass',
      address: {
        '@type': 'PostalAddress',
        streetAddress: event.venue_address || settings?.address || 'Lagos, Nigeria',
        addressLocality: settings?.city || 'Lagos',
        addressCountry: 'NG',
      },
    },
    organizer: {
      '@type': 'MusicSchool',
      name: settings?.academy_name || 'Triumphant Harmony Brass Music Academy',
      url: SITE_URL,
    },
    eventStatus: new Date(event.date) >= new Date()
      ? 'https://schema.org/EventScheduled'
      : 'https://schema.org/EventCompleted',
  };
}

export function stagePerformanceServiceSchema(settings: WebsiteSettings | null) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Live Music & Event Performance Services',
    provider: {
      '@type': 'MusicSchool',
      name: settings?.academy_name || 'Triumphant Harmony Brass',
      url: SITE_URL,
      telephone: settings?.phone || '+234 703 859 5356',
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Lagos, Nigeria',
    },
    description:
      'Professional live music performance services in Lagos, Nigeria. Booking for wedding ceremonies, church services, corporate galas, private concerts, and special events.',
    url: `${SITE_URL}/stage-performances`,
    image: `${SITE_URL}/images/image.png`,
  };
}

export function faqPageSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
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
      item: `${SITE_URL}${item.url.startsWith('/') ? '' : '/'}${item.url}`,
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
