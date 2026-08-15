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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-navy-900/80 border border-navy-800 p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
            My Payments & Enrollment Receipts
          </h1>
          <p className="text-navy-300 text-sm mt-1">
            Track your course tuition payment statuses and upload receipts for review.
          </p>
        </div>
        <Link
          href="/programs"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-400 text-white font-bold rounded-xl transition-all shadow-glow text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Enroll in New Program</span>
        </Link>
      </div>

      {/* Rejected Payments Alert Banners */}
      {payments.filter((p) => p.status === 'rejected').map((p) => (
        <div
          key={`rejected-alert-${p.id}`}
          className="p-5 bg-red-500/10 border border-red-500/30 rounded-2xl space-y-3 animate-fade-in"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="grow space-y-1">
              <h3 className="text-sm font-bold text-red-300">
                Payment Action Required — {p.enrollment?.course?.name || 'Program Payment'}
              </h3>
              <p className="text-xs text-navy-200 leading-relaxed">
                Your payment of <strong className="text-white">{formatCoursePrice(p.amount, p.currency)}</strong> was reviewed by administrators and marked as <strong className="text-red-400 uppercase">REJECTED</strong>.
              </p>
              <div className="p-3 bg-navy-950/80 border border-red-500/20 rounded-xl text-xs text-red-300">
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
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs transition-colors shrink-0 shadow-sm"
            >
              Resubmit Payment Proof
            </button>
          </div>
        </div>
      ))}

      {/* Payments Table */}
      <div className="bg-navy-900/80 border border-navy-800 rounded-2xl overflow-hidden shadow-xl">
        {payments.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <CreditCard className="w-12 h-12 text-navy-400 mx-auto opacity-50" />
            <p className="text-lg font-semibold text-white">No payment records found</p>
            <p className="text-xs text-navy-400">Enroll in a program to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-navy-950/80 text-xs font-semibold uppercase tracking-wider text-navy-300 border-b border-navy-800">
                <tr>
                  <th className="px-6 py-4">Program / Course</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Submitted Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800/60">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-navy-800/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">
                      <p>{p.enrollment?.course?.name || 'Music Course'}</p>
                      {p.transaction_reference && (
                        <p className="text-xs font-normal text-navy-400 font-mono">Ref: {p.transaction_reference}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-brand-400">
                      {formatCoursePrice(p.amount, p.currency)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={p.status === 'approved' ? 'default' : p.status === 'pending' ? 'info' : 'danger'}>
                        {p.status === 'approved' ? 'APPROVED' : p.status === 'pending' ? 'PENDING REVIEW' : 'REJECTED'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-navy-300 text-xs">{formatDate(p.created_at)}</td>
                    <td className="px-6 py-4 text-right">
                      {p.status === 'rejected' && (
                        <button
                          onClick={() => {
                            setResubmittingPayment(p);
                            setTransactionRef(p.transaction_reference || '');
                            setErrorMsg('');
                            setSuccessMsg('');
                          }}
                          className="px-3 py-1.5 bg-brand-500 hover:bg-brand-400 text-white font-bold rounded-lg text-xs transition-colors"
                        >
                          Resubmit Proof
                        </button>
                      )}
                      {p.status === 'pending' && (
                        <span className="text-xs text-amber-400 font-medium">Awaiting Admin Verification</span>
                      )}
                      {p.status === 'approved' && (
                        <span className="text-xs text-green-400 font-medium flex items-center justify-end gap-1">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-navy-900 border border-navy-700 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-navy-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white font-heading">Resubmit Payment Proof</h3>
                <p className="text-xs text-brand-400 font-semibold">{resubmittingPayment.enrollment?.course?.name}</p>
              </div>
              <button
                onClick={() => setResubmittingPayment(null)}
                className="text-navy-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 rounded-xl bg-green-500/10 border border-green-500/30 text-green-300 text-xs">
                {successMsg}
              </div>
            )}

            <div className="p-3.5 bg-navy-950/80 border border-navy-800 rounded-xl text-xs space-y-1">
              <span className="text-navy-400 font-semibold">Previous Rejection Reason:</span>
              <p className="text-red-300">{resubmittingPayment.rejection_reason || 'Proof unreadable.'}</p>
            </div>

            <form onSubmit={handleResubmit} className="space-y-4">
              {/* File Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-navy-200">
                  Select New Payment Proof File from Device *
                </label>

                {proofPreview ? (
                  <div className="p-4 bg-navy-950 border border-brand-500/40 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={proofPreview} alt="Preview" className="w-12 h-12 object-cover rounded-lg border border-brand-500/30" />
                      <div className="text-xs">
                        <p className="text-white font-semibold truncate">{proofFile?.name || 'New Payment Proof'}</p>
                        <p className="text-green-400 text-[11px]">Ready to upload</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setProofFile(null); setProofPreview(null); }}
                      className="px-2.5 py-1 text-xs text-red-400 hover:bg-red-500/10 rounded-lg"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-navy-700 hover:border-brand-500/60 bg-navy-950/60 rounded-xl p-5 text-center space-y-2 transition-colors cursor-pointer relative">
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(file);
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <Upload className="w-6 h-6 text-brand-400 mx-auto" />
                    <p className="text-xs text-navy-200 font-semibold">Tap to select clear payment photo from device</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-200 mb-1">Transaction Reference / Teller No.</label>
                <input
                  type="text"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  placeholder="e.g. FBN-REF-123456"
                  className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setResubmittingPayment(null)}
                  className="px-4 py-2 text-xs text-navy-300 hover:text-white font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-brand-500 hover:bg-brand-400 text-white font-bold rounded-xl text-xs shadow-glow flex items-center gap-1.5"
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
