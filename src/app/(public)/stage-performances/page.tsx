import { Metadata } from 'next';
import { getWebsiteSettings, getWebsiteContent } from '@/lib/queries/public';
import { organizationSchema, breadcrumbSchema, stagePerformanceServiceSchema, JsonLd } from '@/lib/seo';
import { StagePerformancesClient } from './stage-performances-client';
import { PerformanceGalleryPhoto } from '@/lib/event-gallery-utils';

const siteUrl = 'https://www.thbacademy.org';

export const metadata: Metadata = {
  title: 'Live Music & Event Performances in Lagos | THB Academy',
  description:
    'Book professional live musicians, brass ensembles, keyboardists, saxophonists, vocalists, and live bands from THB Academy for weddings, church services, concerts, and corporate functions in Lagos, Nigeria.',
  alternates: {
    canonical: `${siteUrl}/stage-performances`,
  },
  openGraph: {
    title: 'Live Music & Event Performances in Lagos | THB Academy',
    description:
      'Professional live music performance services for weddings, church services, corporate events, and concerts across Lagos and West Africa.',
    url: `${siteUrl}/stage-performances`,
    siteName: 'Triumphant Harmony Brass Music Academy',
    locale: 'en_NG',
    type: 'website',
    images: [
      {
        url: `${siteUrl}/images/image.png`,
        width: 1200,
        height: 630,
        alt: 'THB Academy Stage & Event Performance Services Lagos',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Live Music & Event Performances in Lagos | THB Academy',
    description:
      'Book professional live musicians, brass ensembles, keyboardists, saxophonists, vocalists, and live bands for your events in Lagos, Nigeria.',
    images: [`${siteUrl}/images/image.png`],
  },
};

export default async function StagePerformancesPage() {
  const [settings, galleryContent] = await Promise.all([
    getWebsiteSettings(),
    getWebsiteContent('performance_gallery'),
  ]);

  const photos: PerformanceGalleryPhoto[] = (galleryContent?.metadata as any)?.photos || [];

  return (
    <>
      <JsonLd data={organizationSchema(settings)} />
      <JsonLd data={stagePerformanceServiceSchema(settings)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Stage & Event Performances', url: '/stage-performances' },
        ])}
      />

      <StagePerformancesClient settings={settings} initialGalleryPhotos={photos} />
    </>
  );
}
