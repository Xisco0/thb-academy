import type { Metadata } from 'next';
import Link from 'next/link';
import { AdminTopBar } from '@/components/admin/top-bar';
import { Badge } from '@/components/ui/badge';
import { getAllVenues } from '@/lib/queries/admin';

export const metadata: Metadata = {
  title: 'Venues | Admin',
};

export default async function VenuesPage() {
  const data = await getAllVenues();

  return (
    <div className="space-y-6">
      <AdminTopBar 
        title="Venues" 
        actions={<Link href="/admin/venues/new" className="px-4 py-2 bg-brand-500 text-navy-950 rounded-lg text-sm font-semibold hover:bg-brand-400 transition-colors">Add New</Link>} 
      />

      <div className="bg-navy-800/50 border border-navy-700/30 rounded-xl overflow-hidden">
        {data.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg font-semibold text-navy-200 mb-1">No venues found</p>
            <p className="text-navy-400 text-sm">Get started by adding your first venue.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="text-xs font-semibold uppercase text-navy-400 bg-navy-800/80">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Address</th>
                <th className="px-6 py-3">City</th>
                <th className="px-6 py-3">Capacity</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Default</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700/30">
              {data.map((venue: Record<string, any>) => (
                <tr key={venue.id} className="hover:bg-navy-700/30 group">
                  <td className="px-6 py-4 text-sm text-navy-200">
                    <Link href={`/admin/venues/${venue.id}`} className="font-medium text-white hover:text-primary-400 transition-colors">
                      {venue.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-navy-200">{venue.address}</td>
                  <td className="px-6 py-4 text-sm text-navy-200">{venue.city}</td>
                  <td className="px-6 py-4 text-sm text-navy-200">{venue.capacity || '-'}</td>
                  <td className="px-6 py-4 text-sm text-navy-200">
                    <Badge variant={venue.is_active ? 'default' : 'info'}>
                      {venue.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-navy-200">
                    {venue.is_default && <Badge variant="default">Default</Badge>}
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
