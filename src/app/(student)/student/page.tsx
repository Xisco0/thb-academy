import { getUser } from '@/lib/auth/session';
import { getStudentProfile, getStudentEnrollments, getStudentPayments } from '@/lib/queries/student';
import { formatCoursePrice, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowRight, BookOpen, CreditCard, Calendar, AlertTriangle } from 'lucide-react';

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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back, {profile?.first_name || 'Student'}!</h1>
          <p className="text-slate-400 mt-1">Here&apos;s what&apos;s happening with your musical journey.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/programs" className="px-4 py-2 bg-navy-800 hover:bg-navy-700 text-white rounded-lg transition-colors border border-navy-700/50 text-sm font-medium">
            Explore Programs
          </Link>
          <Link href="/student/payments" className="px-4 py-2 bg-brand-500 hover:bg-brand-400 text-white font-bold rounded-lg transition-colors text-sm">
            My Payments & Receipts
          </Link>
        </div>
      </div>

      {/* Rejected Payment Alert Banner */}
      {rejectedPayments.map((p: any) => (
        <div key={p.id} className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start justify-between gap-4 text-xs">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-300">Payment Rejected — {p.enrollment?.course?.name || 'Program Payment'}</p>
              <p className="text-navy-200 mt-0.5">Reason: {p.rejection_reason || 'Payment receipt unreadable.'}</p>
            </div>
          </div>
          <Link
            href="/student/payments"
            className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg shrink-0 shadow-sm"
          >
            Resubmit Proof
          </Link>
        </div>
      ))}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-navy-800/80 rounded-xl p-5 border border-navy-700/50">
          <div className="flex items-center gap-3 text-brand-400 mb-2">
            <BookOpen className="w-5 h-5" />
            <h3 className="font-semibold">Active Enrollments</h3>
          </div>
          <p className="text-3xl font-bold text-white">{activeEnrollments}</p>
        </div>
        <div className="bg-navy-800/80 rounded-xl p-5 border border-navy-700/50">
          <div className="flex items-center gap-3 text-emerald-400 mb-2">
            <CreditCard className="w-5 h-5" />
            <h3 className="font-semibold">Total Verified Payments</h3>
          </div>
          <p className="text-3xl font-bold text-white">{formatCoursePrice(totalPayments)}</p>
        </div>
        <div className="bg-navy-800/80 rounded-xl p-5 border border-navy-700/50">
          <div className="flex items-center gap-3 text-amber-400 mb-2">
            <Calendar className="w-5 h-5" />
            <h3 className="font-semibold">Pending Payments</h3>
          </div>
          <p className="text-3xl font-bold text-white">{pendingPayments}</p>
        </div>
      </div>

      <div className="bg-navy-800/80 rounded-xl border border-navy-700/50 overflow-hidden">
        <div className="p-5 border-b border-navy-700/50 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Recent Enrollments</h2>
          <Link href="/student/enrollments" className="text-brand-400 hover:text-brand-300 text-sm font-medium flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="divide-y divide-navy-700/50">
          {enrollments.slice(0, 5).map((enrollment: Record<string, any>) => (
            <div key={enrollment.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-medium text-lg text-white">{enrollment.course?.name || 'Music Course'}</h3>
                <p className="text-sm text-slate-400">
                  {enrollment.course?.instrument?.name} • Enrolled on {formatDate(enrollment.created_at)}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant={
                  enrollment.status === 'active' ? 'default' : 
                  enrollment.status === 'pending' ? 'info' : 'danger'
                }>
                  {enrollment.status}
                </Badge>
                {enrollment.status === 'pending' && (
                  <Link href="/student/payments" className="text-brand-400 hover:text-brand-300 text-sm font-medium px-3 py-1.5 rounded-lg bg-brand-500/10 hover:bg-brand-500/20 transition-colors">
                    Upload Payment Proof
                  </Link>
                )}
              </div>
            </div>
          ))}
          {enrollments.length === 0 && (
            <div className="p-8 text-center text-slate-400">
              You don&apos;t have any enrollments yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
