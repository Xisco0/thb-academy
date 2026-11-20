import { getUser } from '@/lib/auth/session';
import { getStudentProfile, getStudentEnrollments, getStudentPayments } from '@/lib/queries/student';
import { formatCoursePrice, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowRight, BookOpen, CreditCard, Calendar, AlertTriangle, Music, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Dashboard | Student Portal',
};

export default async function StudentDashboard() {
  const user = await getUser();
  const profile = await getStudentProfile(user?.id || '');
  const enrollments = profile ? await getStudentEnrollments(profile.id) : [];
  const payments = profile ? await getStudentPayments(profile.id) : [];

  const activeEnrollments = enrollments.filter((e: Record<string, any>) => e.status === 'active').length;
  const totalPayments = payments
    .filter((p: Record<string, any>) => p.status === 'approved')
    .reduce((acc: number, p: Record<string, any>) => acc + Number(p.amount || 0), 0);
  const pendingPayments = payments.filter((p: Record<string, any>) => p.status === 'pending').length;
  const rejectedPayments = payments.filter((p: Record<string, any>) => p.status === 'rejected');

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-[#E7E5DF] shadow-xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C58A19] block mb-1">
            Student Overview
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#142544] tracking-tight">
            Welcome back, {profile?.first_name || 'Student'}!
          </h1>
          <p className="text-[#647084] text-sm mt-1">
            Here&apos;s a summary of your musical training, courses, and tuition status.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/programs"
            className="px-5 py-2.5 bg-[#F8F7F4] hover:bg-[#F5F0E6] text-[#142544] rounded-full transition-colors border border-[#E7E5DF] text-xs font-semibold"
          >
            Explore Programs
          </Link>
          <Link
            href="/student/payments"
            className="px-5 py-2.5 bg-[#C58A19] hover:bg-[#b07b14] text-white font-semibold rounded-full transition-all shadow-xs text-xs"
          >
            My Payments &amp; Receipts
          </Link>
        </div>
      </div>

      {/* Rejected Payment Alert Banner */}
      {rejectedPayments.map((p: any) => (
        <div
          key={p.id}
          className="p-4 bg-[#C74646]/10 border border-[#C74646]/30 rounded-2xl flex items-start justify-between gap-4 text-xs"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#C74646] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#C74646]">Payment Verification Required &mdash; {p.enrollment?.course?.name || 'Program Payment'}</p>
              <p className="text-[#142544] mt-0.5">Note: {p.rejection_reason || 'Payment receipt unclear.'}</p>
            </div>
          </div>
          <Link
            href="/student/payments"
            className="px-3.5 py-1.5 bg-[#C74646] hover:bg-[#b03a3a] text-white font-semibold rounded-full shrink-0 shadow-xs text-xs"
          >
            Resubmit Proof
          </Link>
        </div>
      ))}

      {/* Key Metric Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-[#E7E5DF] shadow-xs">
          <div className="flex items-center gap-3 text-[#142544] mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#F8EBCB] text-[#C58A19] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm">Active Enrollments</h3>
          </div>
          <p className="font-heading text-3xl font-extrabold text-[#142544]">{activeEnrollments}</p>
          <p className="text-xs text-[#647084] mt-1">Course tracks in progress</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E7E5DF] shadow-xs">
          <div className="flex items-center gap-3 text-[#142544] mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#23845B]/15 text-[#23845B] flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm">Verified Tuition</h3>
          </div>
          <p className="font-heading text-3xl font-extrabold text-[#142544]">{formatCoursePrice(totalPayments)}</p>
          <p className="text-xs text-[#647084] mt-1">Approved payment records</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E7E5DF] shadow-xs">
          <div className="flex items-center gap-3 text-[#142544] mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#C58A19]/15 text-[#C58A19] flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm">Pending Verifications</h3>
          </div>
          <p className="font-heading text-3xl font-extrabold text-[#142544]">{pendingPayments}</p>
          <p className="text-xs text-[#647084] mt-1">Awaiting admin review</p>
        </div>
      </div>

      {/* Recent Enrollments Table / Card */}
      <div className="bg-white rounded-2xl border border-[#E7E5DF] overflow-hidden shadow-xs">
        <div className="p-6 border-b border-[#E7E5DF] flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-[#142544]">Recent Enrollments</h2>
          <Link
            href="/student/enrollments"
            className="text-xs font-semibold text-[#C58A19] hover:text-[#9A680C] flex items-center gap-1 transition-colors"
          >
            <span>View all courses</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-[#E7E5DF]">
          {enrollments.length === 0 ? (
            <div className="p-8 text-center text-[#647084] text-sm">
              You have not enrolled in any programs yet.
              <div className="mt-3">
                <Link
                  href="/programs"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#142544] text-white rounded-full text-xs font-semibold"
                >
                  <span>Browse Programs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            enrollments.slice(0, 5).map((enrollment: Record<string, any>) => (
              <div key={enrollment.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F8F7F4]/50 transition-colors">
                <div className="space-y-1">
                  <h3 className="font-heading font-bold text-base text-[#142544]">
                    {enrollment.course?.name || 'Music Course'}
                  </h3>
                  <p className="text-xs text-[#647084]">
                    {enrollment.course?.instrument?.name && `${enrollment.course.instrument.name} • `}
                    Enrolled on {formatDate(enrollment.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={enrollment.status === 'active' ? 'success' : 'default'}>
                    {enrollment.status.toUpperCase()}
                  </Badge>
                  <Link
                    href={`/programs/${enrollment.course?.slug || ''}`}
                    className="text-xs font-semibold text-[#142544] hover:text-[#C58A19] transition-colors"
                  >
                    Details &rarr;
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
