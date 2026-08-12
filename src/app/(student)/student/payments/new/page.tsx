'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function NewPaymentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // These would typically come from props via a server component wrapper or use hook
  const pendingEnrollments = [
    { id: '1', course: { name: 'Piano Basics' }, price: 150000 },
    { id: '2', course: { name: 'Vocal Masterclass' }, price: 200000 }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/student/payments');
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Submit Payment</h1>
        <p className="text-slate-400 mt-1">Upload your proof of payment for verification.</p>
      </div>

      <div className="bg-navy-800/80 rounded-xl border border-navy-700/50 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white border-b border-navy-700/50 pb-2">Payment Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Select Enrollment</label>
                <select className="w-full bg-navy-900 border border-navy-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all">
                  <option value="">Select an enrollment...</option>
                  {pendingEnrollments.map(e => (
                    <option key={e.id} value={e.id}>{e.course.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Amount (₦)</label>
                <input 
                  type="number" 
                  className="w-full bg-navy-900 border border-navy-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                  placeholder="Enter amount"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Transaction Reference</label>
              <input 
                type="text" 
                className="w-full bg-navy-900 border border-navy-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                placeholder="E.g. Bank transfer reference or narration"
              />
            </div>
          </div>

          <div className="bg-navy-900/50 rounded-lg p-4 border border-navy-700/50 space-y-3">
            <h4 className="font-medium text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-brand-400" />
              Bank Transfer Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="block text-slate-400">Bank Name</span>
                <span className="font-medium text-white">Guaranty Trust Bank</span>
              </div>
              <div>
                <span className="block text-slate-400">Account Number</span>
                <span className="font-medium text-white font-mono">0123456789</span>
              </div>
              <div>
                <span className="block text-slate-400">Account Name</span>
                <span className="font-medium text-white">THB Music Academy</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Proof of Payment</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-navy-700 border-dashed rounded-lg hover:border-brand-500/50 transition-colors bg-navy-900/50">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-slate-500" />
                <div className="flex text-sm justify-center text-slate-400">
                  <label className="relative cursor-pointer rounded-md font-medium text-brand-400 hover:text-brand-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-500 focus-within:ring-offset-navy-900">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*,.pdf" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-slate-500">PNG, JPG, PDF up to 5MB</p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-navy-700/50">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2.5 rounded-lg font-medium text-slate-300 hover:bg-navy-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-navy-950 font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                'Submitting...'
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Submit Payment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
