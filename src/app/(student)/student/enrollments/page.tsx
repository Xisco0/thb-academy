import { getUser } from '@/lib/auth/session';
import { getStudentProfile, getStudentEnrollments } from '@/lib/queries/student';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Music, ArrowRight, Calendar, Clock } from 'lucide-react';

export const metadata = {
  title: 'My Enrollments | Student Portal',
};

export default async function EnrollmentsPage() {
  const user = await getUser();
  const profile = await getStudentProfile(user?.id || '');
  const enrollments = profile ? await getStudentEnrollments(profile.id) : [];

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#C58A19] block mb-1">
          Academic Records
        </span>
        <h1 className="font-heading text-3xl font-bold text-[#142544] tracking-tight">My Enrollments</h1>
        <p className="text-[#647084] text-sm mt-1">Manage your course enrollments, schedules, and active learning tracks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrollments.map((enrollment: Record<string, any>) => (
          <div 
            key={enrollment.id} 
            className={`bg-white rounded-2xl p-6 border transition-all shadow-xs ${
              enrollment.status === 'active' 
                ? 'border-[#C58A19]/40 hover:shadow-md' 
                : 'border-[#E7E5DF]'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#F8EBCB] text-[#C58A19] flex items-center justify-center">
                <Music className="w-6 h-6" />
              </div>
              <Badge variant={
                enrollment.status === 'active' ? 'success' : 
                enrollment.status === 'pending' ? 'warning' : 'default'
              }>
                {enrollment.status.toUpperCase()}
              </Badge>
            </div>
            
            <h3 className="font-heading text-xl font-bold text-[#142544] mb-1">
              {enrollment.course?.name || 'Music Course'}
            </h3>
            <p className="text-[#C58A19] text-xs font-semibold uppercase tracking-wider mb-4">
              {enrollment.course?.instrument?.name || 'General Instrument'}
            </p>
            
            <div className="space-y-2 text-xs text-[#647084] mb-6 pt-3 border-t border-[#E7E5DF]">
              <div className="flex justify-between">
                <span>Enrolled Date:</span>
                <span className="font-medium text-[#142544]">{formatDate(enrollment.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tuition:</span>
                <span className="font-bold text-[#142544]">{formatCurrency(enrollment.price || 0)}</span>
              </div>
            </div>

            {enrollment.status === 'pending' && (
              <Link 
                href={`/student/payments/new?enrollment=${enrollment.id}`}
                className="w-full block text-center px-4 py-2.5 bg-[#C58A19] hover:bg-[#b07b14] text-white font-semibold rounded-full transition-colors text-xs"
              >
                Submit Payment Receipt
              </Link>
            )}
            {enrollment.status === 'active' && (
              <Link 
                href={`/programs/${enrollment.course?.slug || ''}`}
                className="w-full block text-center px-4 py-2.5 bg-[#F8F7F4] hover:bg-[#F5F0E6] text-[#142544] border border-[#E7E5DF] font-semibold rounded-full transition-colors text-xs"
              >
                View Course Syllabus &rarr;
              </Link>
            )}
          </div>
        ))}
      </div>

      {enrollments.length === 0 && (
        <div className="bg-white rounded-3xl p-12 border border-[#E7E5DF] text-center max-w-lg mx-auto shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#F8EBCB] text-[#C58A19] flex items-center justify-center mx-auto">
            <Music className="w-8 h-8" />
          </div>
          <h3 className="font-heading text-xl font-bold text-[#142544]">No Enrollments Yet</h3>
          <p className="text-[#647084] text-xs sm:text-sm leading-relaxed">
            You have not registered for any music programs yet. Browse our courses to begin your musical journey with THB Academy.
          </p>
          <div className="pt-2">
            <Link 
              href="/programs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#142544] hover:bg-[#243653] text-white font-semibold rounded-full text-xs transition-colors"
            >
              <span>Explore Programs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
