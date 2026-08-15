import type { Metadata } from 'next';
import { AdminTopBar } from '@/components/admin/top-bar';
import { getAllEvents } from '@/lib/queries/admin';
import { EventsClient } from './events-client';

export const metadata: Metadata = {
  title: 'Live Concerts & Events | Admin',
};

export default async function EventsPage() {
  const events = await getAllEvents();

  return (
    <div className="space-y-6">
      <AdminTopBar title="Live Concerts & Events Management" />
      <EventsClient events={events} />
    </div>
  );
}
