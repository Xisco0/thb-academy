'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatCoursePrice } from '@/lib/utils';
import { compressImageFile } from '@/lib/image-utils';
import { resubmitPaymentProofAction } from '@/lib/actions/registration-actions';
import {
  CreditCard,
  Plus,
  Upload,
  AlertTriangle,
  CheckCircle2,
  FileCheck,
  X,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';

interface StudentPayment {
  id: string;
  amount: number;
  currency: string;
  payment_method: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  proof_url?: string;
  transaction_reference?: string;
  created_at: string;
  enrollment?: {
    course?: {
      name: string;
      price: number;
      currency: string;
    };
  };
}

export function StudentPaymentsClient({ payments }: { payments: StudentPayment[] }) {
  const router = useRouter();
  const [resubmittingPayment, setResubmittingPayment] = useState<StudentPayment | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [transactionRef, setTransactionRef] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  async function handleFileSelect(file: File) {
    try {
      setErrorMsg('');
      const compressed = await compressImageFile(file, 1200, 1200, 0.75);
      setProofFile(file);
      setProofPreview(compressed);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to process selected image file.');
    }
  }

  async function handleResubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!resubmittingPayment || !proofPreview) {
      setErrorMsg('Please select a valid payment proof image before submitting.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await resubmitPaymentProofAction({
        payment_id: resubmittingPayment.id,
        proof_url: proofPreview,
        transaction_reference: transactionRef,
      });

      setLoading(false);

      if (!res.success) {
        setErrorMsg(res.error || 'Failed to resubmit payment proof.');
      } else {
        setSuccessMsg(res.message || 'Payment proof resubmitted successfully!');
        setTimeout(() => {
          setResubmittingPayment(null);
          setProofPreview(null);
          setProofFile(null);
          setTransactionRef('');
          router.refresh();
        }, 1200);
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'An unexpected error occurred. Please try again.');
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-[#E7E5DF] p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#142544] tracking-tight">
            My Payments & Receipts
          </h1>
          <p className="text-[#647084] text-sm mt-1">
            Track your course tuition payment statuses, verification history, and receipts.
          </p>
        </div>
        <Link
          href="/programs"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C58A19] hover:bg-[#A37013] text-white font-semibold rounded-full transition-all shadow-sm text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Enroll in New Program</span>
        </Link>
      </div>

      {/* Rejected Payments Alert Banners */}
      {payments.filter((p) => p.status === 'rejected').map((p) => (
        <div
          key={`rejected-alert-${p.id}`}
          className="p-5 bg-[#FEF2F2] border border-[#FECACA] rounded-2xl space-y-3 animate-fade-in"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
            <div className="grow space-y-1">
              <h3 className="text-sm font-bold text-[#991B1B]">
                Payment Action Required — {p.enrollment?.course?.name || 'Program Payment'}
              </h3>
              <p className="text-xs text-[#7F1D1D] leading-relaxed">
                Your payment of <strong className="text-[#142544]">{formatCoursePrice(p.amount, p.currency)}</strong> was reviewed by administrators and marked as <strong className="text-[#DC2626] uppercase">REJECTED</strong>.
              </p>
              <div className="p-3 bg-white border border-[#FECACA] rounded-xl text-xs text-[#991B1B]">
                <strong>Rejection Reason:</strong> {p.rejection_reason || 'Payment proof was unreadable or amount did not match.'}
              </div>
            </div>
            <button
              onClick={() => {
                setResubmittingPayment(p);
                setTransactionRef(p.transaction_reference || '');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="px-4 py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold rounded-xl text-xs transition-colors shrink-0 shadow-sm"
            >
              Resubmit Proof
            </button>
          </div>
        </div>
      ))}

      {/* Payments Table */}
      <div className="bg-white border border-[#E7E5DF] rounded-2xl overflow-hidden shadow-sm">
        {payments.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <CreditCard className="w-12 h-12 text-[#C58A19] mx-auto opacity-50" />
            <p className="text-lg font-semibold text-[#142544]">No payment records found</p>
            <p className="text-xs text-[#647084]">Enroll in an academy program to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-[#F8F7F4] text-xs font-semibold uppercase tracking-wider text-[#647084] border-b border-[#E7E5DF]">
                <tr>
                  <th className="px-6 py-4">Program / Course</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Submitted Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E5DF]">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F8F7F4]/60 transition-colors">
                    <td className="px-6 py-4 font-semibold text-[#142544]">
                      <p>{p.enrollment?.course?.name || 'Music Course'}</p>
                      {p.transaction_reference && (
                        <p className="text-xs font-normal text-[#8896AB] font-mono mt-0.5">Ref: {p.transaction_reference}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-[#C58A19]">
                      {formatCoursePrice(p.amount, p.currency)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={p.status === 'approved' ? 'default' : p.status === 'pending' ? 'info' : 'danger'}>
                        {p.status === 'approved' ? 'APPROVED' : p.status === 'pending' ? 'PENDING REVIEW' : 'REJECTED'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-[#647084] text-xs">{formatDate(p.created_at)}</td>
                    <td className="px-6 py-4 text-right">
                      {p.status === 'rejected' && (
                        <button
                          onClick={() => {
                            setResubmittingPayment(p);
                            setTransactionRef(p.transaction_reference || '');
                            setErrorMsg('');
                            setSuccessMsg('');
                          }}
                          className="px-3.5 py-1.5 bg-[#C58A19] hover:bg-[#A37013] text-white font-medium rounded-lg text-xs transition-colors shadow-sm"
                        >
                          Resubmit Proof
                        </button>
                      )}
                      {p.status === 'pending' && (
                        <span className="text-xs text-[#D97706] font-medium">Awaiting Admin Review</span>
                      )}
                      {p.status === 'approved' && (
                        <span className="text-xs text-[#23845B] font-medium flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Verified & Active</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Resubmit Payment Proof Modal */}
      {resubmittingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-[#E7E5DF] rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#E7E5DF] pb-3">
              <div>
                <h3 className="text-lg font-bold text-[#142544] font-heading">Resubmit Payment Proof</h3>
                <p className="text-xs text-[#C58A19] font-medium">{resubmittingPayment.enrollment?.course?.name}</p>
              </div>
              <button
                onClick={() => setResubmittingPayment(null)}
                className="text-[#647084] hover:text-[#142544] p-1 rounded-lg hover:bg-[#F8F7F4] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-xs">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534] text-xs">
                {successMsg}
              </div>
            )}

            <div className="p-3.5 bg-[#FEF2F2]/50 border border-[#FECACA] rounded-xl text-xs space-y-1">
              <span className="text-[#991B1B] font-semibold">Previous Rejection Reason:</span>
              <p className="text-[#7F1D1D]">{resubmittingPayment.rejection_reason || 'Proof unreadable or amount mismatch.'}</p>
            </div>

            <form onSubmit={handleResubmit} className="space-y-4">
              {/* File Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#142544]">
                  Select New Payment Proof File from Device *
                </label>

                {proofPreview ? (
                  <div className="p-4 bg-[#F8F7F4] border border-[#C58A19]/40 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={proofPreview} alt="Preview" className="w-12 h-12 object-cover rounded-lg border border-[#C58A19]/30" />
                      <div className="text-xs">
                        <p className="text-[#142544] font-semibold truncate">{proofFile?.name || 'New Payment Proof'}</p>
                        <p className="text-[#23845B] text-[11px] font-medium">Ready to upload</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setProofFile(null); setProofPreview(null); }}
                      className="px-2.5 py-1 text-xs text-[#DC2626] hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-[#E7E5DF] hover:border-[#C58A19] bg-[#F8F7F4] rounded-xl p-5 text-center space-y-2 transition-colors cursor-pointer relative">
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(file);
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <Upload className="w-6 h-6 text-[#C58A19] mx-auto" />
                    <p className="text-xs text-[#142544] font-semibold">Tap to select clear payment photo from device</p>
                    <p className="text-[11px] text-[#8896AB]">PNG, JPG, or PDF up to 5MB</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#142544] mb-1">Transaction Reference / Teller No.</label>
                <input
                  type="text"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  placeholder="e.g. FBN-REF-123456"
                  className="w-full px-3 py-2 bg-white border border-[#E7E5DF] rounded-xl text-sm text-[#142544] focus:border-[#C58A19] focus:ring-1 focus:ring-[#C58A19] outline-none transition-all placeholder:text-[#8896AB]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setResubmittingPayment(null)}
                  className="px-4 py-2 text-xs text-[#647084] hover:text-[#142544] font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-[#C58A19] hover:bg-[#A37013] text-white font-semibold rounded-full text-xs shadow-sm flex items-center gap-1.5 transition-all"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileCheck className="w-3.5 h-3.5" />}
                  <span>{loading ? 'Submitting...' : 'Submit New Payment Proof'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
