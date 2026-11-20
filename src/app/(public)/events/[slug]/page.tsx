import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getEventBySlug, getWebsiteSettings, getAllEventSlugs } from '@/lib/queries/public';
import { eventSchema as eventJsonLd, JsonLd, breadcrumbSchema } from '@/lib/seo';
import { formatDate, formatTime } from '@/lib/utils';
import { Phone, MessageCircle, Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { parseEventActivityPhotos } from '@/lib/event-gallery-utils';
import { EventActivityGallery } from './event-gallery-client';

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getAllEventSlugs();
  return slugs.map((slug) => ({ slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: 'Event Not Found' };

  const baseUrl = 'https://www.thbacademy.org';

  let imageUrl = `${baseUrl}/images/image.png`;
  if (event.banner_url && event.banner_url.trim()) {
    const rawImage = event.banner_url.trim();
    if (rawImage.startsWith('http://') || rawImage.startsWith('https://')) {
      imageUrl = rawImage;
    } else {
      imageUrl = `${baseUrl}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`;
    }
  }

  const pageTitle = event.seo_title || `${event.title} | THB Academy`;
  const socialDescription =
    event.seo_description ||
    event.description ||
    `Join us for ${event.title} at Triumphant Harmony Brass Music Academy.`;
  const canonicalUrl = `${baseUrl}/events/${event.slug}`;

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
          alt: `${event.title} Banner`,
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

export default async function EventDetailsPage({ params }: Props) {
  const { slug } = await params;
  const [event, settings] = await Promise.all([
    getEventBySlug(slug),
    getWebsiteSettings(),
  ]);

  if (!event) {
    notFound();
  }

  const { cleanContent, photos } = parseEventActivityPhotos(event.detailed_content || null);

  const startDate = new Date(event.date);
  const now = new Date();
  const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
  
  const isOngoing = now >= startDate && now <= endDate;
  const isPast = now > endDate;

  return (
    <main className="min-h-screen bg-white text-[#17243A] pt-24 pb-20">
      <JsonLd data={eventJsonLd(event, settings)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Events', url: '/events' },
          { name: event.title, url: `/events/${event.slug}` },
        ])}
      />

      {/* 1. Header / Hero */}
      <section className="py-12 px-4 bg-gradient-to-b from-[#F8F7F4] via-white to-white border-b border-[#E7E5DF]">
        <div className="max-w-5xl mx-auto space-y-6">
          <nav className="text-xs sm:text-sm text-[#647084] flex items-center gap-2">
            <Link href="/" className="hover:text-[#C58A19] transition-colors">Home</Link>
            <span>&rsaquo;</span>
            <Link href="/events" className="hover:text-[#C58A19] transition-colors">Events</Link>
            <span>&rsaquo;</span>
            <span className="text-[#142544] font-medium truncate max-w-xs">{event.title}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center px-3.5 py-1 text-xs font-bold rounded-full border ${
                isOngoing
                  ? 'bg-[#23845B]/15 text-[#23845B] border-[#23845B]/30'
                  : isPast
                  ? 'bg-[#F8F7F4] text-[#647084] border-[#E7E5DF]'
                  : 'bg-[#F8EBCB] text-[#9A680C] border-[#C58A19]/30'
              }`}
            >
              {isOngoing ? '● Active & Ongoing Program' : isPast ? 'Completed' : 'Upcoming Event'}
            </span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-[#142544] font-bold leading-tight">
            {event.title}
          </h1>

          {/* Quick Schedule Overview Bar */}
          <div className="grid sm:grid-cols-3 gap-6 bg-white p-6 rounded-2xl border border-[#E7E5DF] shadow-xs">
            <div>
              <p className="text-[11px] text-[#647084] font-bold uppercase tracking-wider mb-1">Date</p>
              <p className="text-[#142544] font-heading font-bold text-base">{formatDate(event.date)}</p>
            </div>
            <div>
              <p className="text-[11px] text-[#647084] font-bold uppercase tracking-wider mb-1">Session Time</p>
              <p className="text-[#142544] font-heading font-bold text-base">
                {event.start_time ? formatTime(event.start_time) : 'TBD'}
                {event.end_time ? ` - ${formatTime(event.end_time)}` : ''}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-[#647084] font-bold uppercase tracking-wider mb-1">Location / Venue</p>
              <p className="text-[#142544] font-heading font-bold text-base truncate">
                {event.venue_name || 'Lagos, Nigeria'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Banner & Content */}
      <section className="py-12 px-4 max-w-5xl mx-auto space-y-10">
        {event.banner_url && (
          <div className="rounded-2xl overflow-hidden border border-[#E7E5DF] shadow-sm bg-[#F8F7F4]">
            <img src={event.banner_url} alt={event.title} className="w-full h-auto object-cover max-h-[500px]" />
          </div>
        )}

        {/* Detailed Event Text */}
        <div className="bg-[#F8F7F4] border border-[#E7E5DF] rounded-2xl p-8 space-y-4">
          <h2 className="font-heading text-2xl font-bold text-[#142544]">
            Event Details &amp; Overview
          </h2>
          <div className="text-[#647084] leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
            {cleanContent || event.description}
          </div>
        </div>

        {/* Activity Photos Gallery if present */}
        {photos && photos.length > 0 && (
          <div className="space-y-6">
            <h2 className="font-heading text-2xl font-bold text-[#142544]">
              Program Activity Highlights
            </h2>
            <EventActivityGallery photos={photos} />
          </div>
        )}

        {/* Contact Admissions CTA */}
        <div className="bg-white border border-[#E7E5DF] rounded-2xl p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="font-heading font-bold text-xl text-[#142544]">Have Questions About This Event?</h3>
            <p className="text-[#647084] text-xs sm:text-sm">Contact our admissions coordinator for participation and seat reservations.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/contact"
              className="px-6 py-3 bg-[#142544] hover:bg-[#243653] text-white font-semibold rounded-full text-xs sm:text-sm transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
