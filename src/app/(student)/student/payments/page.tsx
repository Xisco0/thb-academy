import { getUser } from '@/lib/auth/session';
import { getStudentProfile, getStudentPayments } from '@/lib/queries/student';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export const metadata = {
  title: 'My Payments | Student Portal'
};

export default async function PaymentsPage() {
  const user = await getUser();
  const profile = await getStudentProfile(user?.id || '');
  const payments = profile ? await getStudentPayments(profile.id) : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Payments History</h1>
          <p className="text-slate-400 mt-1">View your past transactions and submit new payments.</p>
        </div>
        <Link 
          href="/student/payments/new" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-navy-950 font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Submit Payment
        </Link>
      </div>

      <div className="bg-navy-800/80 rounded-xl border border-navy-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-navy-900/50 border-b border-navy-700/50 text-slate-300">
              <tr>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Course</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Method</th>
                <th className="px-6 py-4 font-medium">Reference</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700/50">
              {payments.map((payment: Record<string, any>) => (
                <tr key={payment.id} className="hover:bg-navy-700/30 transition-colors">
                  <td className="px-6 py-4 text-slate-300">{formatDate(payment.created_at)}</td>
                  <td className="px-6 py-4 text-white font-medium">
                    {payment.enrollment?.course?.name || 'General Payment'}
                  </td>
                  <td className="px-6 py-4 text-white font-medium">{formatCurrency(payment.amount)}</td>
                  <td className="px-6 py-4 text-slate-300 capitalize">{payment.payment_method?.replace('_', ' ') || 'Bank Transfer'}</td>
                  <td className="px-6 py-4 text-slate-400 font-mono text-xs">{payment.reference_number || '-'}</td>
                  <td className="px-6 py-4">
                    <Badge variant={
                      payment.status === 'approved' ? 'success' :
                      payment.status === 'rejected' ? 'danger' :
                      payment.status === 'pending' ? 'warning' : 'default'
                    }>
                      {payment.status}
                    </Badge>
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No payments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
