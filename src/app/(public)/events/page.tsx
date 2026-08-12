import { Metadata } from 'next';
import Link from 'next/link';
import { cn, formatTime } from '@/lib/utils';
import { getPublishedEvents } from '@/lib/queries/public';
import type { Event } from '@/types/database.types';

export const metadata: Metadata = {
  title: 'Events & Performances | THB Academy',
  description: 'Join us for upcoming recitals, concerts, and masterclasses at Triumphant Harmony Brass Academy.',
};

export default async function EventsPage() {
  const events = await getPublishedEvents();
  
  const now = new Date();
  const upcomingEvents = events.filter(e => new Date(e.date) >= now).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const pastEvents = events.filter(e => new Date(e.date) < now).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <main className="min-h-screen bg-navy-950 text-slate-300">
      <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-navy-950 to-navy-900">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-5xl text-white font-bold mb-6">
            Events & Performances
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Experience the magic of live music. Join our students and faculty in upcoming concerts and masterclasses.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading text-3xl text-white mb-8 border-b border-navy-800 pb-4">Upcoming Events</h2>
          
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
              No past events found.
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
  const eventDate = new Date(event.date);
  const isPast = eventDate < new Date();

  const formattedDate = eventDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group bg-navy-800/80 border border-navy-700/50 rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(212,152,42,0.1)] transition-all duration-300 flex flex-col"
    >
      {event.banner_url ? (
        <div className="aspect-video w-full overflow-hidden bg-navy-900 relative">
          <img src={event.banner_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      ) : (
        <div className="h-2 bg-brand-500 w-full" />
      )}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <span
            className={cn(
              'inline-block px-3 py-1 text-xs font-semibold rounded-full border',
              isPast
                ? 'bg-navy-900/50 text-navy-400 border-navy-700/50'
                : 'bg-brand-500/10 text-brand-400 border-brand-500/20'
            )}
          >
            {isPast ? 'Completed' : 'Upcoming'}
          </span>
        </div>
        <h3 className="font-heading text-xl text-white font-bold mb-2 group-hover:text-brand-400 transition-colors">
          {event.title}
        </h3>
        <div className="mt-auto pt-4 space-y-2 text-sm text-navy-400">
          <div className="flex items-center gap-2">
            <span className="text-brand-500">📅</span>
            {formattedDate}
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
