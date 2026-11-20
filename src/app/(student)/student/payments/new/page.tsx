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
        <h1 className="text-3xl font-heading font-bold text-[#142544] tracking-tight">Submit Payment</h1>
        <p className="text-[#647084] mt-1">Upload your proof of payment for administrative verification.</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E7E5DF] p-6 md:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#142544] border-b border-[#E7E5DF] pb-2 font-heading">
              Payment Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#142544]">Select Enrollment</label>
                <select className="w-full bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl px-4 py-2.5 text-[#142544] focus:ring-1 focus:ring-[#C58A19] focus:border-[#C58A19] focus:bg-white outline-none transition-all">
                  <option value="">Select an enrollment...</option>
                  {pendingEnrollments.map(e => (
                    <option key={e.id} value={e.id}>{e.course.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#142544]">Amount (₦)</label>
                <input 
                  type="number" 
                  className="w-full bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl px-4 py-2.5 text-[#142544] focus:ring-1 focus:ring-[#C58A19] focus:border-[#C58A19] focus:bg-white outline-none transition-all"
                  placeholder="Enter amount"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#142544]">Transaction Reference</label>
              <input 
                type="text" 
                className="w-full bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl px-4 py-2.5 text-[#142544] focus:ring-1 focus:ring-[#C58A19] focus:border-[#C58A19] focus:bg-white outline-none transition-all"
                placeholder="E.g. Bank transfer reference or narration"
              />
            </div>
          </div>

          <div className="bg-[#F8F7F4] rounded-xl p-5 border border-[#E7E5DF] space-y-3">
            <h4 className="font-semibold text-[#142544] flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4 text-[#C58A19]" />
              Official Bank Account Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="block text-xs text-[#647084] font-medium">Bank Name</span>
                <span className="font-semibold text-[#142544]">First Bank of Nigeria</span>
              </div>
              <div>
                <span className="block text-xs text-[#647084] font-medium">Account Number</span>
                <span className="font-semibold text-[#142544] font-mono">2041261358</span>
              </div>
              <div>
                <span className="block text-xs text-[#647084] font-medium">Account Name</span>
                <span className="font-semibold text-[#142544]">Triumphant Harmony Brass</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#142544]">Proof of Payment</label>
            <div className="mt-1 flex justify-center px-6 pt-6 pb-6 border-2 border-[#E7E5DF] border-dashed rounded-xl hover:border-[#C58A19] transition-colors bg-[#F8F7F4]/50">
              <div className="space-y-2 text-center">
                <Upload className="mx-auto h-10 w-10 text-[#C58A19]" />
                <div className="flex text-sm justify-center text-[#647084]">
                  <label className="relative cursor-pointer rounded-md font-semibold text-[#C58A19] hover:text-[#A37013] focus-within:outline-none">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*,.pdf" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-[#8896AB]">PNG, JPG, PDF up to 5MB</p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-[#E7E5DF]">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2.5 rounded-full font-medium text-[#647084] hover:bg-[#F8F7F4] hover:text-[#142544] transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#C58A19] hover:bg-[#A37013] text-white font-semibold rounded-full transition-all flex items-center gap-2 disabled:opacity-70 text-sm shadow-sm"
            >
              {isSubmitting ? (
                'Submitting...'
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
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
