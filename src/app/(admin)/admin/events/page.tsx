import type { Metadata } from 'next';
import Link from 'next/link';
import { AdminTopBar } from '@/components/admin/top-bar';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { getAllEvents } from '@/lib/queries/admin';

export const metadata: Metadata = {
  title: 'Events | Admin',
};

export default async function EventsPage() {
  const data = await getAllEvents();

  return (
    <div className="space-y-6">
      <AdminTopBar 
        title="Events" 
        actions={<Link href="/admin/events/new" className="px-4 py-2 bg-brand-500 text-navy-950 rounded-lg text-sm font-semibold hover:bg-brand-400 transition-colors">Add New</Link>} 
      />

      <div className="bg-navy-800/50 border border-navy-700/30 rounded-xl overflow-hidden">
        {data.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg font-semibold text-navy-200 mb-1">No events found</p>
            <p className="text-navy-400 text-sm">Get started by adding your first event.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="text-xs font-semibold uppercase text-navy-400 bg-navy-800/80">
              <tr>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Venue</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700/30">
              {data.map((event: Record<string, any>) => (
                <tr key={event.id} className="hover:bg-navy-700/30 group">
                  <td className="px-6 py-4 text-sm text-navy-200">
                    <Link href={`/admin/events/${event.id}`} className="font-medium text-white hover:text-primary-400 transition-colors">
                      {event.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-navy-200">{formatDate(event.date)}</td>
                  <td className="px-6 py-4 text-sm text-navy-200">{event.venue?.name || '-'}</td>
                  <td className="px-6 py-4 text-sm text-navy-200">
                    <Badge variant={event.status === 'published' ? 'default' : 'info'}>
                      {event.status || 'Draft'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
