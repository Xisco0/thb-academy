import type { Metadata } from 'next';
import Link from 'next/link';
import { AdminTopBar } from '@/components/admin/top-bar';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { getAllCourses } from '@/lib/queries/admin';

export const metadata: Metadata = {
  title: 'Courses | Admin',
};

export default async function CoursesPage() {
  const data = await getAllCourses();

  return (
    <div className="space-y-6">
      <AdminTopBar 
        title="Courses" 
        actions={<Link href="/admin/courses/new" className="px-4 py-2 bg-brand-500 text-navy-950 rounded-lg text-sm font-semibold hover:bg-brand-400 transition-colors">Add New</Link>} 
      />

      <div className="bg-navy-800/50 border border-navy-700/30 rounded-xl overflow-hidden">
        {data.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg font-semibold text-navy-200 mb-1">No courses found</p>
            <p className="text-navy-400 text-sm">Get started by adding your first course.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="text-xs font-semibold uppercase text-navy-400 bg-navy-800/80">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Instrument</th>
                <th className="px-6 py-3">Level</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700/30">
              {data.map((course: Record<string, any>) => (
                <tr key={course.id} className="hover:bg-navy-700/30 group">
                  <td className="px-6 py-4 text-sm text-navy-200">
                    <Link href={`/admin/courses/${course.id}`} className="font-medium text-white hover:text-primary-400 transition-colors">
                      {course.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-navy-200">{course.instrument?.name || '-'}</td>
                  <td className="px-6 py-4 text-sm text-navy-200">
                    <Badge variant="default">{course.level || 'All Levels'}</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-navy-200">{formatCurrency(course.price)}</td>
                  <td className="px-6 py-4 text-sm text-navy-200">
                    <Badge variant={course.status === 'published' ? 'default' : course.status === 'archived' ? 'danger' : 'info'}>
                      {course.status || 'Draft'}
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
