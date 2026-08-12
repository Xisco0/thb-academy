import { getAllPayments } from '@/lib/queries/admin';
import { AdminTopBar } from '@/components/admin/top-bar';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';

export const metadata = {
  title: 'Payments | Admin',
};

export default async function AdminPaymentsPage() {
  const payments = await getAllPayments();

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'rejected':
        return <Badge variant="danger">Rejected</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="flex-1 space-y-6 p-8">
      <AdminTopBar title="Payments" />
      
      <div className="bg-navy-900 border border-navy-800 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 bg-navy-950 uppercase border-b border-navy-800">
              <tr>
                <th className="px-6 py-4 font-medium">Student</th>
                <th className="px-6 py-4 font-medium">Course</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Method</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800">
              {payments?.map((payment: Record<string, any>) => (
                <tr key={payment.id} className="hover:bg-navy-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-200">
                    {payment.student?.profiles?.full_name || 'Unknown Student'}
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {payment.enrollment?.courses?.title || 'Unknown Course'}
                  </td>
                  <td className="px-6 py-4 text-slate-300 font-medium">
                    {formatCurrency(payment.amount, payment.currency || 'NGN')}
                  </td>
                  <td className="px-6 py-4 text-slate-300 capitalize">
                    {payment.payment_method?.replace('_', ' ')}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(payment.status)}
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {formatDate(payment.submitted_at)}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    {payment.proof_url && (
                      <a 
                        href={payment.proof_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gold-500 hover:text-gold-400 transition-colors"
                      >
                        View Proof
                      </a>
                    )}
                    
                    <Link 
                      href={`/admin/payments/${payment.id}`}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {payment.status === 'pending' ? 'Review' : 'Details'}
                    </Link>
                  </td>
                </tr>
              ))}
              {(!payments || payments.length === 0) && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
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
