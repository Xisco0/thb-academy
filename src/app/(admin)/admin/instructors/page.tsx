import type { Metadata } from 'next';
import Link from 'next/link';
import { AdminTopBar } from '@/components/admin/top-bar';
import { Badge } from '@/components/ui/badge';
import { getAllInstructors } from '@/lib/queries/admin';

export const metadata: Metadata = {
  title: 'Instructors | Admin',
};

export default async function InstructorsPage() {
  const data = await getAllInstructors();

  return (
    <div className="space-y-6">
      <AdminTopBar 
        title="Instructors" 
        actions={<Link href="/admin/instructors/new" className="px-4 py-2 bg-brand-500 text-navy-950 rounded-lg text-sm font-semibold hover:bg-brand-400 transition-colors">Add New</Link>} 
      />

      <div className="bg-navy-800/50 border border-navy-700/30 rounded-xl overflow-hidden">
        {data.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg font-semibold text-navy-200 mb-1">No instructors found</p>
            <p className="text-navy-400 text-sm">Get started by adding your first instructor.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="text-xs font-semibold uppercase text-navy-400 bg-navy-800/80">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Specialization</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700/30">
              {data.map((instructor: Record<string, any>) => (
                <tr key={instructor.id} className="hover:bg-navy-700/30 group">
                  <td className="px-6 py-4 text-sm text-navy-200">
                    <Link href={`/admin/instructors/${instructor.id}`} className="font-medium text-white hover:text-primary-400 transition-colors">
                      {instructor.first_name} {instructor.last_name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-navy-200">{instructor.email}</td>
                  <td className="px-6 py-4 text-sm text-navy-200">{instructor.phone || '-'}</td>
                  <td className="px-6 py-4 text-sm text-navy-200">{instructor.specialization || '-'}</td>
                  <td className="px-6 py-4 text-sm text-navy-200">
                    <Badge variant={instructor.is_active ? 'default' : 'info'}>
                      {instructor.is_active ? 'Active' : 'Inactive'}
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
