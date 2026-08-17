import { Metadata } from 'next';
import Link from 'next/link';
import { cn, formatTime } from '@/lib/utils';
import { getPublishedEvents } from '@/lib/queries/public';
import { breadcrumbSchema, JsonLd } from '@/lib/seo';
import type { Event } from '@/types/database.types';

const siteUrl = 'https://www.thbacademy.org';

export const metadata: Metadata = {
  title: 'Events, Recitals & Masterclasses in Lagos',
  description: 'Join us for upcoming music recitals, concerts, and brass masterclasses at Triumphant Harmony Brass Music Academy in Lagos, Nigeria.',
  alternates: {
    canonical: `${siteUrl}/events`,
  },
  openGraph: {
    title: 'Events, Recitals & Masterclasses | Triumphant Harmony Brass',
    description: 'Experience live music recitals, community impact programs, and brass masterclasses at THB Music Academy.',
    url: `${siteUrl}/events`,
    siteName: 'Triumphant Harmony Brass Music Academy',
    locale: 'en_NG',
    type: 'website',
    images: [
      {
        url: `${siteUrl}/images/image.png`,
        width: 1200,
        height: 630,
        alt: 'THB Music Academy Events',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Events, Recitals & Masterclasses | Triumphant Harmony Brass',
    description: 'Upcoming recitals, concerts, and masterclasses at Triumphant Harmony Brass Academy.',
    images: [`${siteUrl}/images/image.png`],
  },
};

export default async function EventsPage() {
  const events = await getPublishedEvents();
  
  const now = new Date();
  
  // An event is active/upcoming if its date + 30 days (for multi-week programs) is >= now
  const upcomingEvents = events.filter(e => {
    const startDate = new Date(e.date);
    const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    return endDate >= now || startDate >= now;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastEvents = events.filter(e => {
    const startDate = new Date(e.date);
    const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    return endDate < now && startDate < now;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <main className="min-h-screen bg-navy-950 text-slate-300">
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Events', url: '/events' },
        ])}
      />

      <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-navy-950 to-navy-900">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-brand-500/10 border border-brand-500/20 text-brand-400 uppercase tracking-widest">
            Community & Concerts
          </span>
          <h1 className="font-heading text-4xl md:text-5xl text-white font-bold">
            Events & Music Programs
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Experience live music recitals, community impact programs, and brass masterclasses at Triumphant Harmony Brass.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading text-3xl text-white mb-8 border-b border-navy-800 pb-4 flex items-center gap-3">
            <span>Active & Upcoming Events</span>
            <span className="text-xs px-3 py-1 bg-green-500/15 border border-green-500/30 text-green-400 rounded-full font-bold">Live</span>
          </h2>
          
          {upcomingEvents.length === 0 ? (
            <p className="text-slate-500 italic mb-16 bg-navy-900/50 p-6 rounded-xl border border-navy-800">
              No upcoming events scheduled at the moment. Check back soon!
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {upcomingEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}

          <h2 className="font-heading text-3xl text-white mb-8 border-b border-navy-800 pb-4">Past Events</h2>
          {pastEvents.length === 0 ? (
            <p className="text-slate-500 italic bg-navy-900/50 p-6 rounded-xl border border-navy-800">
              No past events recorded.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function EventCard({ event }: { event: Event }) {
  const startDate = new Date(event.date);
  const now = new Date();
  const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
  
  const isOngoing = now >= startDate && now <= endDate;
  const isPast = now > endDate;

  const formattedDate = startDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group bg-navy-800/80 border border-navy-700/50 rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all duration-300 flex flex-col"
    >
      {event.banner_url ? (
        <div className="aspect-video w-full overflow-hidden bg-navy-900 relative">
          <img src={event.banner_url} alt={`${event.title} Banner`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      ) : (
        <div className="h-2 bg-brand-500 w-full" />
      )}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <span
            className={cn(
              'inline-block px-3 py-1 text-xs font-bold rounded-full border',
              isOngoing
                ? 'bg-green-500/20 text-green-400 border-green-500/40 animate-pulse'
                : isPast
                ? 'bg-navy-900/50 text-navy-400 border-navy-700/50'
                : 'bg-brand-500/10 text-brand-400 border-brand-500/20'
            )}
          >
            {isOngoing ? '● Active & Ongoing' : isPast ? 'Completed' : 'Upcoming Event'}
          </span>
        </div>
        <h3 className="font-heading text-xl text-white font-bold mb-2 group-hover:text-brand-400 transition-colors line-clamp-2">
          {event.title}
        </h3>
        <div className="mt-auto pt-4 space-y-2 text-sm text-navy-400">
          <div className="flex items-center gap-2">
            <span className="text-brand-500">📅</span>
            <span>{formattedDate} {isOngoing && '(4-Week Active Program)'}</span>
          </div>
          {event.start_time && (
            <div className="flex items-center gap-2">
              <span className="text-brand-500">⏰</span>
              {formatTime(event.start_time)}
              {event.end_time ? ` - ${formatTime(event.end_time)}` : ''}
            </div>
          )}
          {event.venue_name && (
            <div className="flex items-center gap-2 line-clamp-1">
              <span className="text-brand-500">📍</span>
              {event.venue_name}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
