import { getUser } from '@/lib/auth/session';
import { getStudentProfile, getStudentEnrollments, getStudentPayments } from '@/lib/queries/student';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowRight, BookOpen, CreditCard, Calendar } from 'lucide-react';

export const metadata = {
  title: 'Dashboard | Student Portal'
};

export default async function StudentDashboard() {
  const user = await getUser();
  const profile = await getStudentProfile(user?.id || '');
  const enrollments = profile ? await getStudentEnrollments(profile.id) : [];
  const payments = profile ? await getStudentPayments(profile.id) : [];

  const activeEnrollments = enrollments.filter((e: Record<string, any>) => e.status === 'active').length;
  const totalPayments = payments.filter((p: Record<string, any>) => p.status === 'approved').reduce((acc: number, p: Record<string, any>) => acc + p.amount, 0);
  const pendingPayments = payments.filter((p: Record<string, any>) => p.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back, {profile?.first_name || 'Student'}!</h1>
          <p className="text-slate-400 mt-1">Here's what's happening with your musical journey.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/programs" className="px-4 py-2 bg-navy-800 hover:bg-navy-700 text-white rounded-lg transition-colors border border-navy-700/50 text-sm font-medium">
            View Programs
          </Link>
          <Link href="/student/payments/new" className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-navy-950 rounded-lg transition-colors font-medium text-sm">
            Make Payment
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-navy-800/80 rounded-xl p-5 border border-navy-700/50">
          <div className="flex items-center gap-3 text-brand-400 mb-2">
            <BookOpen className="w-5 h-5" />
            <h3 className="font-semibold">Active Enrollments</h3>
          </div>
          <p className="text-3xl font-bold text-white">{activeEnrollments}</p>
        </div>
        <div className="bg-navy-800/80 rounded-xl p-5 border border-navy-700/50">
          <div className="flex items-center gap-3 text-success-400 mb-2">
            <CreditCard className="w-5 h-5" />
            <h3 className="font-semibold">Total Payments</h3>
          </div>
          <p className="text-3xl font-bold text-white">{formatCurrency(totalPayments)}</p>
        </div>
        <div className="bg-navy-800/80 rounded-xl p-5 border border-navy-700/50">
          <div className="flex items-center gap-3 text-warning-400 mb-2">
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
                <h3 className="font-medium text-lg text-white">{enrollment.course?.name || 'Unknown Course'}</h3>
                <p className="text-sm text-slate-400">
                  {enrollment.course?.instrument?.name} • Enrolled on {formatDate(enrollment.created_at)}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant={
                  enrollment.status === 'active' ? 'success' : 
                  enrollment.status === 'pending' ? 'warning' : 'default'
                }>
                  {enrollment.status}
                </Badge>
                {enrollment.status === 'pending' && (
                  <Link href="/student/payments/new" className="text-brand-400 hover:text-brand-300 text-sm font-medium px-3 py-1.5 rounded-lg bg-brand-500/10 hover:bg-brand-500/20 transition-colors">
                    Pay Now
                  </Link>
                )}
              </div>
            </div>
          ))}
          {enrollments.length === 0 && (
            <div className="p-8 text-center text-slate-400">
              You don't have any enrollments yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
