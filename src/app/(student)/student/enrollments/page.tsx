import { getUser } from '@/lib/auth/session';
import { getStudentProfile, getStudentEnrollments } from '@/lib/queries/student';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Music } from 'lucide-react';

export const metadata = {
  title: 'My Enrollments | Student Portal'
};

export default async function EnrollmentsPage() {
  const user = await getUser();
  const profile = await getStudentProfile(user?.id || '');
  const enrollments = profile ? await getStudentEnrollments(profile.id) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">My Enrollments</h1>
        <p className="text-slate-400 mt-1">Manage your course enrollments and progress.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrollments.map((enrollment: Record<string, any>) => (
          <div 
            key={enrollment.id} 
            className={`bg-navy-800/80 rounded-xl p-6 border transition-all ${
              enrollment.status === 'active' 
                ? 'border-brand-500/30 ring-1 ring-brand-500/20' 
                : 'border-navy-700/50'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-navy-900 rounded-lg text-brand-400">
                <Music className="w-6 h-6" />
              </div>
              <Badge variant={
                enrollment.status === 'active' ? 'success' : 
                enrollment.status === 'pending' ? 'warning' : 'default'
              }>
                {enrollment.status}
              </Badge>
            </div>
            
            <h3 className="text-xl font-semibold text-white mb-1">
              {enrollment.course?.name || 'Unknown Course'}
            </h3>
            <p className="text-brand-400 text-sm mb-4">
              {enrollment.course?.instrument?.name || 'General'}
            </p>
            
            <div className="space-y-2 text-sm text-slate-300 mb-6">
              <div className="flex justify-between">
                <span className="text-slate-400">Enrolled:</span>
                <span>{formatDate(enrollment.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Price:</span>
                <span className="font-medium text-white">{formatCurrency(enrollment.price || 0)}</span>
              </div>
            </div>

            {enrollment.status === 'pending' && (
              <Link 
                href={`/student/payments/new?enrollment=${enrollment.id}`}
                className="w-full block text-center px-4 py-2 bg-brand-500 hover:bg-brand-600 text-navy-950 font-medium rounded-lg transition-colors"
              >
                Make Payment
              </Link>
            )}
            {enrollment.status === 'active' && (
              <Link 
                href={`/student/schedule?enrollment=${enrollment.id}`}
                className="w-full block text-center px-4 py-2 bg-navy-700 hover:bg-navy-600 text-white font-medium rounded-lg transition-colors"
              >
                View Schedule
              </Link>
            )}
          </div>
        ))}
      </div>

      {enrollments.length === 0 && (
        <div className="bg-navy-800/50 rounded-xl p-12 border border-navy-700/50 text-center">
          <Music className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">No Enrollments Yet</h3>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            You haven't enrolled in any courses yet. Browse our programs to start your musical journey.
          </p>
          <Link 
            href="/programs"
            className="inline-block px-6 py-3 bg-brand-500 hover:bg-brand-600 text-navy-950 font-medium rounded-lg transition-colors"
          >
            Explore Programs
          </Link>
        </div>
      )}
    </div>
  );
}
