'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, CheckCircle2, XCircle, Eye, Loader2, CreditCard, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatCurrency } from '@/lib/utils';
import { updatePaymentStatusAction } from '@/lib/actions/admin-actions';

interface PaymentProps {
  id: string;
  amount: number;
  currency: string;
  payment_method: string;
  proof_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  rejection_reason?: string;
  student?: {
    profile?: {
      first_name: string;
      last_name: string;
      email: string;
    };
  };
  enrollment?: {
    course?: {
      name: string;
    };
  };
}

export function PaymentsClient({ payments }: { payments: PaymentProps[] }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filtered = payments.filter((p) => {
    const studentName = `${p.student?.profile?.first_name || ''} ${p.student?.profile?.last_name || ''}`.toLowerCase();
    const courseName = (p.enrollment?.course?.name || '').toLowerCase();

    const matchesSearch = studentName.includes(search.toLowerCase()) || courseName.includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  async function handleApprove(id: string) {
    setLoadingId(id);
    await updatePaymentStatusAction(id, 'approved');
    setLoadingId(null);
    router.refresh();
  }

  async function handleRejectSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!rejectingId) return;
    setLoadingId(rejectingId);
    await updatePaymentStatusAction(rejectingId, 'rejected', rejectReason);
    setLoadingId(null);
    setRejectingId(null);
    setRejectReason('');
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-navy-900/80 border border-navy-800 p-4 rounded-2xl">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-navy-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search payments by student or course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-navy-950/80 border border-navy-700/60 rounded-xl text-sm text-white placeholder:text-navy-400 focus:border-brand-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-navy-950/80 border border-navy-700/60 rounded-xl text-sm text-white focus:border-brand-500"
          >
            <option value="all">All Payment Statuses</option>
            <option value="pending">Pending Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-navy-900/80 border border-navy-800 rounded-2xl overflow-hidden shadow-xl">
        {filtered.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <CreditCard className="w-12 h-12 text-navy-400 mx-auto opacity-50" />
            <p className="text-lg font-semibold text-white">No payment records found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-navy-950/80 text-xs font-semibold uppercase tracking-wider text-navy-300 border-b border-navy-800">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Course</th>
                  <th className="px-6 py-4">Amount Paid</th>
                  <th className="px-6 py-4">Proof</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800/60 text-sm">
                {filtered.map((p) => {
                  const prof = (p.student?.profile || {}) as { first_name?: string; last_name?: string; email?: string };
                  return (
                    <tr key={p.id} className="hover:bg-navy-800/40 transition-colors">
                      <td className="px-6 py-4 font-semibold text-white">
                        <p>{prof.first_name || 'Student'} {prof.last_name || ''}</p>
                        <p className="text-xs font-normal text-navy-300">{prof.email}</p>
                      </td>
                      <td className="px-6 py-4 text-brand-300 font-semibold">{p.enrollment?.course?.name || 'Music Course'}</td>
                      <td className="px-6 py-4 font-bold text-white">{formatCurrency(p.amount)}</td>
                      <td className="px-6 py-4">
                        {p.proof_url ? (
                          <button
                            onClick={() => setProofImage(p.proof_url || null)}
                            className="px-3 py-1 bg-navy-950 border border-brand-500/40 text-brand-400 rounded-lg text-xs font-semibold hover:bg-navy-800 transition-colors inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Proof</span>
                          </button>
                        ) : (
                          <span className="text-xs text-navy-400">No Receipt</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={p.status === 'approved' ? 'default' : p.status === 'pending' ? 'info' : 'danger'}>
                          {p.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-navy-300">{formatDate(p.created_at)}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {p.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(p.id)}
                              disabled={loadingId === p.id}
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg text-xs transition-colors inline-flex items-center gap-1 shadow-sm"
                            >
                              {loadingId === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => setRejectingId(p.id)}
                              disabled={loadingId === p.id}
                              className="px-3 py-1.5 bg-red-600/80 hover:bg-red-500 text-white font-bold rounded-lg text-xs transition-colors inline-flex items-center gap-1 shadow-sm"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Proof Image Viewer Modal */}
      {proofImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="bg-navy-900 border border-navy-700 rounded-2xl max-w-2xl w-full p-4 relative space-y-4">
            <div className="flex items-center justify-between border-b border-navy-800 pb-3">
              <h3 className="text-white font-bold font-heading">Payment Proof Receipt</h3>
              <button onClick={() => setProofImage(null)} className="text-navy-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto rounded-xl bg-black flex items-center justify-center p-2">
              <img src={proofImage} alt="Payment Proof" className="max-w-full max-h-[65vh] object-contain rounded-lg" />
            </div>
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-navy-900 border border-navy-800 rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white font-heading">Reject Payment Proof?</h3>
            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-navy-200 mb-1">Reason for Rejection</label>
                <textarea
                  rows={3}
                  required
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Receipt unreadable or transaction reference invalid."
                  className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500 resize-none"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setRejectingId(null)} className="px-4 py-2 text-sm text-navy-300 hover:text-white">Cancel</button>
                <button type="submit" disabled={loadingId === rejectingId} className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-sm shadow-md">
                  {loadingId === rejectingId ? 'Rejecting...' : 'Confirm Reject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
