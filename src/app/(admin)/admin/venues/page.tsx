import type { Metadata } from 'next';
import { AdminTopBar } from '@/components/admin/top-bar';
import { getAllVenues } from '@/lib/queries/admin';
import { VenuesClient } from './venues-client';

export const metadata: Metadata = {
  title: 'Venues Management | Admin',
};

export default async function VenuesPage() {
  const venues = await getAllVenues();

  return (
    <div className="space-y-6">
      <AdminTopBar title="Venues Management" />
      <VenuesClient venues={venues} />
    </div>
  );
}
