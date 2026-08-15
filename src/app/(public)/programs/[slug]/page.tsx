import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCourseBySlug, getWebsiteSettings, getSiblingCoursesByInstrument } from '@/lib/queries/public';
import { courseSchema, breadcrumbSchema, JsonLd } from '@/lib/seo';
import { ProgramDetailClient } from './program-detail-client';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return { title: 'Program Not Found' };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thbacademy.org';

  // Resolve OpenGraph image URL: Use course image if available, fallback to website logo
  let imageUrl = `${baseUrl}/images/logo.png`;
  if (course.image_url && course.image_url.trim()) {
    const rawImage = course.image_url.trim();
    if (rawImage.startsWith('http://') || rawImage.startsWith('https://')) {
      imageUrl = rawImage;
    } else {
      imageUrl = `${baseUrl}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`;
    }
  }

  // Extract clean concise description for OpenGraph/Twitter (max 160 characters)
  const rawDescription = course.seo_description || course.description || `Master ${course.name} at Triumphant Harmony Brass Music Academy in Lagos, Nigeria. Professional music instruction for all levels.`;
  const cleanDescription = rawDescription.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
  const socialDescription = cleanDescription.length > 155 ? `${cleanDescription.substring(0, 152).trim()}...` : cleanDescription;

  const pageTitle = course.seo_title || `${course.name} (${course.level?.toUpperCase() || 'PROGRAM'}) | THB Music Academy`;
  const canonicalUrl = `${baseUrl}/programs/${course.slug}`;

  return {
    title: pageTitle,
    description: socialDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description: socialDescription,
      url: canonicalUrl,
      siteName: 'Triumphant Harmony Brass Music Academy',
      locale: 'en_NG',
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${course.name} - THB Music Academy`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: socialDescription,
      images: [imageUrl],
    },
  };
}

export default async function ProgramDetailPage({ params }: Props) {
  const { slug } = await params;
  const [course, settings] = await Promise.all([
    getCourseBySlug(slug),
    getWebsiteSettings(),
  ]);

  if (!course) {
    notFound();
  }

  const siblingCourses = await getSiblingCoursesByInstrument(course.instrument_id);

  return (
    <>
      <JsonLd data={courseSchema(course, settings)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Programs', url: '/programs' },
          { name: course.name, url: `/programs/${course.slug}` },
        ])}
      />

      <ProgramDetailClient initialCourse={course} siblingCourses={siblingCourses} />
    </>
  );
}
