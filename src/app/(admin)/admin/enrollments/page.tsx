import type { Metadata } from 'next';
import Link from 'next/link';
import { AdminTopBar } from '@/components/admin/top-bar';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { getAllEnrollments } from '@/lib/queries/admin';

export const metadata: Metadata = {
  title: 'Enrollments | Admin',
};

export default async function EnrollmentsPage() {
  const data = await getAllEnrollments();

  return (
    <div className="space-y-6">
      <AdminTopBar 
        title="Enrollments" 
        actions={<Link href="/admin/enrollments/new" className="px-4 py-2 bg-brand-500 text-navy-950 rounded-lg text-sm font-semibold hover:bg-brand-400 transition-colors">Add New</Link>} 
      />

      <div className="bg-navy-800/50 border border-navy-700/30 rounded-xl overflow-hidden">
        {data.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg font-semibold text-navy-200 mb-1">No enrollments found</p>
            <p className="text-navy-400 text-sm">Get started by creating your first enrollment.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="text-xs font-semibold uppercase text-navy-400 bg-navy-800/80">
              <tr>
                <th className="px-6 py-3">Student Name</th>
                <th className="px-6 py-3">Course</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Enrollment Date</th>
                <th className="px-6 py-3">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700/30">
              {data.map((enrollment: Record<string, any>) => (
                <tr key={enrollment.id} className="hover:bg-navy-700/30 group">
                  <td className="px-6 py-4 text-sm text-navy-200">
                    <Link href={`/admin/enrollments/${enrollment.id}`} className="font-medium text-white hover:text-primary-400 transition-colors">
                      {enrollment.student?.profile?.first_name} {enrollment.student?.profile?.last_name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-navy-200">{enrollment.course?.name || '-'}</td>
                  <td className="px-6 py-4 text-sm text-navy-200">
                    <Badge variant={enrollment.status === 'active' ? 'default' : 'info'}>
                      {enrollment.status || 'Active'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-navy-200">{formatDate(enrollment.created_at)}</td>
                  <td className="px-6 py-4 text-sm text-navy-200">{formatCurrency(enrollment.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
