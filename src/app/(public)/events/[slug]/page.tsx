import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getEventBySlug, getWebsiteSettings } from '@/lib/queries/public';
import { eventSchema as eventJsonLd, JsonLd, breadcrumbSchema } from '@/lib/seo';
import { formatDate, formatTime } from '@/lib/utils';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: 'Event Not Found' };

  return {
    title: event.seo_title || event.title,
    description: event.seo_description || event.description || `${event.title} at Triumphant Harmony Brass`,
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

  const eventDate = new Date(event.date);
  const isPast = eventDate < new Date();

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
          <nav className="text-sm text-navy-400 mb-6">
            <Link href="/" className="hover:text-brand-400 transition-colors">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/events" className="hover:text-brand-400 transition-colors">Events</Link>
            <span className="mx-2">›</span>
            <span className="text-navy-200">{event.title}</span>
          </nav>

          <div className="mb-4">
            <span
              className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${
                isPast
                  ? 'bg-navy-700/50 text-navy-400 border-navy-600/50'
                  : 'bg-brand-500/10 text-brand-400 border-brand-500/20'
              }`}
            >
              {isPast ? 'Completed' : 'Upcoming'}
            </span>
          </div>

          <h1 className="font-heading text-4xl md:text-5xl text-white font-bold mb-8">
            {event.title}
          </h1>

          <div className="grid sm:grid-cols-3 gap-6 bg-navy-800/80 p-6 rounded-xl border border-navy-700/50">
            <div>
              <p className="text-sm text-navy-400 mb-1">Date</p>
              <p className="text-white font-medium text-lg">{formatDate(event.date)}</p>
            </div>
            <div>
              <p className="text-sm text-navy-400 mb-1">Time</p>
              <p className="text-white font-medium text-lg">
                {event.start_time ? formatTime(event.start_time) : 'TBD'}
                {event.end_time ? ` - ${formatTime(event.end_time)}` : ''}
              </p>
            </div>
            <div>
              <p className="text-sm text-navy-400 mb-1">Location</p>
              <p className="text-white font-medium text-lg">
                {event.venue_name || 'TBD'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {event.banner_url && (
            <div className="aspect-[21/9] w-full rounded-xl overflow-hidden bg-navy-900 border border-navy-800 mb-12">
              <img
                src={event.banner_url}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {event.description && (
            <div className="text-navy-200 whitespace-pre-wrap leading-relaxed text-lg mb-8">
              {event.description}
            </div>
          )}

          {event.detailed_content && (
            <div className="text-navy-300 whitespace-pre-wrap leading-relaxed">
              {event.detailed_content}
            </div>
          )}

          {event.venue_address && (
            <div className="mt-10 p-6 bg-navy-800/80 border border-navy-700/50 rounded-xl">
              <h3 className="text-white font-semibold mb-2">Venue</h3>
              <p className="text-navy-300">{event.venue_name}</p>
              <p className="text-navy-400 text-sm">{event.venue_address}</p>
            </div>
          )}

          {!isPast && (
            <div className="mt-16 text-center p-10 bg-navy-800/80 border border-brand-500/20 rounded-xl shadow-glow">
              <h3 className="font-heading text-3xl text-white mb-4">
                Join Us for this Event
              </h3>
              <p className="text-navy-400 mb-8 text-lg">
                Mark your calendar and be part of this incredible musical experience.
              </p>
              <Link
                href="/contact"
                className="inline-block bg-brand-500 hover:bg-brand-400 text-navy-950 font-bold px-10 py-4 rounded-lg transition-colors hover:shadow-glow"
              >
                Contact Us to RSVP
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
