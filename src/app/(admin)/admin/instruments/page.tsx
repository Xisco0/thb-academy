import type { Metadata } from 'next';
import { AdminTopBar } from '@/components/admin/top-bar';
import { getAllInstruments } from '@/lib/queries/admin';
import { InstrumentsClient } from './instruments-client';

export const metadata: Metadata = {
  title: 'Instruments Management | Admin',
};

export default async function InstrumentsPage() {
  const instruments = await getAllInstruments();

  return (
    <div className="space-y-6">
      <AdminTopBar title="Instruments Management" />
      <InstrumentsClient instruments={instruments} />
    </div>
  );
}
