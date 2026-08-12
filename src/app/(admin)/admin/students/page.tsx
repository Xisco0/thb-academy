import type { Metadata } from 'next';
import Link from 'next/link';
import { AdminTopBar } from '@/components/admin/top-bar';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { getAllStudents } from '@/lib/queries/admin';

export const metadata: Metadata = {
  title: 'Students | Admin',
};

export default async function StudentsPage() {
  const data = await getAllStudents();

  return (
    <div className="space-y-6">
      <AdminTopBar 
        title="Students" 
        actions={<Link href="/admin/students/new" className="px-4 py-2 bg-brand-500 text-navy-950 rounded-lg text-sm font-semibold hover:bg-brand-400 transition-colors">Add New</Link>} 
      />

      <div className="bg-navy-800/50 border border-navy-700/30 rounded-xl overflow-hidden">
        {data.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg font-semibold text-navy-200 mb-1">No students found</p>
            <p className="text-navy-400 text-sm">Get started by adding your first student.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="text-xs font-semibold uppercase text-navy-400 bg-navy-800/80">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700/30">
              {data.map((student: Record<string, any>) => {
                const profile = student.profile || {};
                return (
                  <tr key={student.id} className="hover:bg-navy-700/30 group">
                    <td className="px-6 py-4 text-sm text-navy-200">
                      <Link href={`/admin/students/${student.id}`} className="font-medium text-white hover:text-primary-400 transition-colors">
                        {profile.first_name} {profile.last_name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-navy-200">{profile.email}</td>
                    <td className="px-6 py-4 text-sm text-navy-200">{profile.phone || '-'}</td>
                    <td className="px-6 py-4 text-sm text-navy-200">
                      <Badge variant={student.status === 'active' ? 'default' : 'info'}>
                        {student.status || 'Active'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-navy-200">
                      {formatDate(student.created_at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
