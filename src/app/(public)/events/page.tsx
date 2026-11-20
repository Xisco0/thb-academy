import { Metadata } from 'next';
import Link from 'next/link';
import { cn, formatTime } from '@/lib/utils';
import { getPublishedEvents } from '@/lib/queries/public';
import { breadcrumbSchema, JsonLd } from '@/lib/seo';
import type { Event } from '@/types/database.types';
import { Calendar, Clock, MapPin, Sparkles, ArrowRight } from 'lucide-react';

const siteUrl = 'https://www.thbacademy.org';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Events, Recitals & Masterclasses in Lagos | THB Academy',
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
    <main className="min-h-screen bg-white text-[#17243A] pt-24 pb-20">
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Events', url: '/events' },
        ])}
      />

      {/* 1. Header / Hero */}
      <section className="relative py-16 md:py-24 px-4 bg-gradient-to-b from-[#F8F7F4] via-white to-white border-b border-[#E7E5DF]">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F8EBCB] text-[#9A680C] text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-[#C58A19]" />
            Community &amp; Concert Showcases
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#142544] tracking-tight leading-tight">
            Academy Events &amp; <br />
            <span className="text-[#C58A19] font-normal italic">
              Concert Recitals
            </span>
          </h1>
          <p className="text-base sm:text-lg text-[#647084] max-w-2xl mx-auto leading-relaxed pt-2">
            Experience live student recitals, brass masterclasses, and community impact training at Triumphant Harmony Brass.
          </p>
        </div>
      </section>

      {/* 2. Events Grid */}
      <section className="py-16 px-4 max-w-7xl mx-auto space-y-16">
        <div>
          <div className="flex items-center justify-between border-b border-[#E7E5DF] pb-4 mb-8">
            <h2 className="font-heading text-2xl sm:text-3xl text-[#142544] font-bold flex items-center gap-3">
              <span>Active &amp; Upcoming Events</span>
              <span className="text-xs px-3 py-1 bg-[#23845B]/15 text-[#23845B] border border-[#23845B]/30 rounded-full font-bold">
                Live
              </span>
            </h2>
          </div>
          
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-12 bg-[#F8F7F4] rounded-2xl border border-[#E7E5DF] p-6 text-[#647084] text-sm">
              No upcoming events scheduled at the moment. Check back soon!
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>

        {/* Past Events */}
        <div>
          <h2 className="font-heading text-2xl sm:text-3xl text-[#142544] font-bold border-b border-[#E7E5DF] pb-4 mb-8">
            Past Events &amp; Archives
          </h2>
          {pastEvents.length === 0 ? (
            <div className="text-center py-12 bg-[#F8F7F4] rounded-2xl border border-[#E7E5DF] p-6 text-[#647084] text-sm">
              No past events recorded.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      className="group bg-white border border-[#E7E5DF] rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-[0_16px_36px_-6px_rgba(20,37,68,0.1)] hover:border-[#C58A19]/50 transition-all duration-300 flex flex-col shadow-xs"
    >
      {event.banner_url ? (
        <div className="aspect-video w-full overflow-hidden bg-[#F8F7F4] relative border-b border-[#E7E5DF]">
          <img
            src={event.banner_url}
            alt={`${event.title} Banner`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="h-3 bg-[#C58A19] w-full" />
      )}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <span
            className={cn(
              'inline-block px-3 py-1 text-xs font-bold rounded-full border',
              isOngoing
                ? 'bg-[#23845B]/15 text-[#23845B] border-[#23845B]/30'
                : isPast
                ? 'bg-[#F8F7F4] text-[#647084] border-[#E7E5DF]'
                : 'bg-[#F8EBCB] text-[#9A680C] border-[#C58A19]/30'
            )}
          >
            {isOngoing ? '● Active & Ongoing' : isPast ? 'Completed' : 'Upcoming Event'}
          </span>
          <h3 className="font-heading text-xl text-[#142544] font-bold group-hover:text-[#C58A19] transition-colors line-clamp-2">
            {event.title}
          </h3>
        </div>

        <div className="pt-4 border-t border-[#E7E5DF] space-y-2 text-xs text-[#647084]">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#C58A19] shrink-0" />
            <span>{formattedDate} {isOngoing && '(Active Program)'}</span>
          </div>
          {event.start_time && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C58A19] shrink-0" />
              <span>
                {formatTime(event.start_time)}
                {event.end_time ? ` - ${formatTime(event.end_time)}` : ''}
              </span>
            </div>
          )}
          {event.venue_name && (
            <div className="flex items-center gap-2 line-clamp-1">
              <MapPin className="w-4 h-4 text-[#C58A19] shrink-0" />
              <span className="truncate">{event.venue_name}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
