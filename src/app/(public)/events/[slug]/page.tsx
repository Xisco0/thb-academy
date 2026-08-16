import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getEventBySlug, getWebsiteSettings } from '@/lib/queries/public';
import { eventSchema as eventJsonLd, JsonLd, breadcrumbSchema } from '@/lib/seo';
import { formatDate, formatTime } from '@/lib/utils';
import { Phone, MessageCircle } from 'lucide-react';
import { parseEventActivityPhotos } from '@/lib/event-gallery-utils';
import { EventActivityGallery } from './event-gallery-client';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: 'Event Not Found' };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thbacademy.org';

  let imageUrl = `${baseUrl}/images/thb-academy-banner.png`;
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
    <>
      <JsonLd data={eventJsonLd(event, settings)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Events', url: '/events' },
          { name: event.title, url: `/events/${event.slug}` },
        ])}
      />

      {/* Hero */}
      <section className="pt-32 pb-12 px-4 bg-navy-900 border-b border-navy-800/50">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm text-navy-400 mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-brand-400 transition-colors">Home</Link>
            <span>›</span>
            <Link href="/events" className="hover:text-brand-400 transition-colors">Events</Link>
            <span>›</span>
            <span className="text-navy-200 truncate">{event.title}</span>
          </nav>

          <div className="mb-4">
            <span
              className={`inline-flex items-center px-3.5 py-1 text-xs font-bold rounded-full border ${
                isOngoing
                  ? 'bg-green-500/20 text-green-400 border-green-500/40 animate-pulse'
                  : isPast
                  ? 'bg-navy-700/50 text-navy-400 border-navy-600/50'
                  : 'bg-brand-500/10 text-brand-400 border-brand-500/20'
              }`}
            >
              {isOngoing ? '● Active & Ongoing Program' : isPast ? 'Completed' : 'Upcoming Event'}
            </span>
          </div>

          <h1 className="font-heading text-3xl md:text-5xl text-white font-bold mb-8 leading-tight">
            {event.title}
          </h1>

          <div className="grid sm:grid-cols-3 gap-6 bg-navy-800/80 p-6 rounded-xl border border-navy-700/50">
            <div>
              <p className="text-xs text-navy-400 font-semibold mb-1 uppercase tracking-wider">Start Date</p>
              <p className="text-white font-bold text-lg">{formatDate(event.date)}</p>
            </div>
            <div>
              <p className="text-xs text-navy-400 font-semibold mb-1 uppercase tracking-wider">Daily Session Time</p>
              <p className="text-white font-bold text-lg">
                {event.start_time ? formatTime(event.start_time) : 'TBD'}
                {event.end_time ? ` - ${formatTime(event.end_time)}` : ''}
              </p>
            </div>
            <div>
              <p className="text-xs text-navy-400 font-semibold mb-1 uppercase tracking-wider">Venue Location</p>
              <p className="text-white font-bold text-lg">
                {event.venue_name || 'TBD'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-10">
          {event.banner_url && (
            <div className="w-full bg-navy-950 rounded-2xl overflow-hidden border border-navy-800 p-2 shadow-2xl flex justify-center">
              <img
                src={event.banner_url}
                alt={`${event.title} Banner`}
                className="max-h-[650px] w-auto h-auto object-contain rounded-xl"
              />
            </div>
          )}

          {event.description && (
            <div className="bg-navy-900/80 p-6 rounded-2xl border border-navy-800 text-navy-200 leading-relaxed text-lg">
              {event.description}
            </div>
          )}

          {cleanContent && (
            <div className="prose prose-invert max-w-none bg-navy-900/60 p-8 rounded-2xl border border-navy-800 text-navy-200 whitespace-pre-wrap leading-relaxed">
              {cleanContent}
            </div>
          )}

          {/* Event Activities & Photos Gallery */}
          <EventActivityGallery photos={photos} />

          {event.venue_address && (
            <div className="p-6 bg-navy-900/80 border border-navy-700/50 rounded-2xl space-y-2">
              <h3 className="text-white font-bold text-lg">Venue & Address</h3>
              <p className="text-brand-400 font-semibold">{event.venue_name}</p>
              <p className="text-navy-300 text-sm">{event.venue_address}</p>
            </div>
          )}

          {!isPast && (
            <div className="p-8 bg-gradient-to-br from-navy-900 to-navy-950 border border-brand-500/30 rounded-2xl shadow-glow text-center space-y-6">
              <div>
                <h3 className="font-heading text-3xl text-white font-bold mb-2">
                  Register for this Free Impact Program
                </h3>
                <p className="text-navy-300 text-sm max-w-xl mx-auto">
                  Limited slots available! First come, first served. Contact program coordinators directly to reserve your slot.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <a
                  href="tel:07038595356"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-brand-500 hover:bg-brand-400 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-glow cursor-pointer"
                >
                  <Phone className="w-5 h-5" />
                  <span>Call: 070 3859 5356</span>
                </a>
                <a
                  href="https://wa.me/2348077566475?text=Hello%2C%20I%20want%20to%20register%20for%20the%201-Month%20Free%20Music%20Training"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-green-600 hover:bg-green-500 text-white font-bold px-8 py-3.5 rounded-xl transition-all cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp: 0807 756 6475</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
