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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white border border-[#E7E5DF] p-4 rounded-2xl shadow-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8896AB] absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search payments by student or course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] placeholder:text-[#8896AB] focus:border-[#C58A19] focus:bg-white outline-none transition-all"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] focus:border-[#C58A19] outline-none"
          >
            <option value="all">All Payment Statuses</option>
            <option value="pending">Pending Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-[#E7E5DF] rounded-2xl overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <CreditCard className="w-12 h-12 text-[#C58A19] mx-auto opacity-40" />
            <p className="text-lg font-bold text-[#142544] font-heading">No payment records found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F8F7F4] text-xs font-semibold uppercase tracking-wider text-[#647084] border-b border-[#E7E5DF]">
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
              <tbody className="divide-y divide-[#E7E5DF] text-sm">
                {filtered.map((p) => {
                  const prof = (p.student?.profile || {}) as { first_name?: string; last_name?: string; email?: string };
                  return (
                    <tr key={p.id} className="hover:bg-[#F8F7F4]/60 transition-colors">
                      <td className="px-6 py-4 font-semibold text-[#142544]">
                        <p>{prof.first_name || 'Student'} {prof.last_name || ''}</p>
                        <p className="text-xs font-normal text-[#647084]">{prof.email}</p>
                      </td>
                      <td className="px-6 py-4 text-[#142544] font-medium">{p.enrollment?.course?.name || 'Music Course'}</td>
                      <td className="px-6 py-4 font-bold text-[#C58A19]">{formatCurrency(p.amount)}</td>
                      <td className="px-6 py-4">
                        {p.proof_url ? (
                          <button
                            onClick={() => setProofImage(p.proof_url || null)}
                            className="px-3 py-1 bg-[#F5F0E6] border border-[#C58A19]/30 text-[#C58A19] rounded-lg text-xs font-semibold hover:bg-[#F8EBCB] transition-colors inline-flex items-center gap-1 shadow-sm"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Proof</span>
                          </button>
                        ) : (
                          <span className="text-xs text-[#8896AB]">No Receipt</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={p.status === 'approved' ? 'default' : p.status === 'pending' ? 'info' : 'danger'}>
                          {p.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-[#8896AB] text-xs">{formatDate(p.created_at)}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {p.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(p.id)}
                              disabled={loadingId === p.id}
                              className="px-3.5 py-1.5 bg-[#23845B] hover:bg-[#1E6F4D] text-white font-medium rounded-full text-xs transition-colors inline-flex items-center gap-1 shadow-sm"
                            >
                              {loadingId === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => setRejectingId(p.id)}
                              disabled={loadingId === p.id}
                              className="px-3.5 py-1.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-medium rounded-full text-xs transition-colors inline-flex items-center gap-1 shadow-sm"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-[#E7E5DF] rounded-2xl max-w-2xl w-full p-5 relative space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E7E5DF] pb-3">
              <h3 className="text-[#142544] font-bold font-heading">Payment Proof Receipt</h3>
              <button onClick={() => setProofImage(null)} className="text-[#647084] hover:text-[#142544] p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto rounded-xl bg-[#F8F7F4] flex items-center justify-center p-3 border border-[#E7E5DF]">
              <img src={proofImage} alt="Payment Proof" className="max-w-full max-h-[65vh] object-contain rounded-lg" />
            </div>
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-[#E7E5DF] rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-[#142544] font-heading">Reject Payment Proof?</h3>
            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#142544] mb-1">Reason for Rejection</label>
                <textarea
                  rows={3}
                  required
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Receipt unreadable or transaction reference invalid."
                  className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] focus:border-[#C58A19] focus:bg-white outline-none resize-none"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setRejectingId(null)} className="px-4 py-2 text-sm text-[#647084] hover:text-[#142544]">Cancel</button>
                <button type="submit" disabled={loadingId === rejectingId} className="px-5 py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold rounded-full text-sm shadow-sm">
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
