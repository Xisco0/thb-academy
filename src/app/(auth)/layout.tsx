import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#17243A] flex flex-col relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[45%] h-[45%] rounded-full bg-[#F8EBCB]/40 blur-[130px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[45%] h-[45%] rounded-full bg-[#F5F0E6] blur-[130px]" />
      </div>

      {/* Header bar with Back to Home button */}
      <header className="relative z-50 w-full p-6 max-w-7xl mx-auto flex justify-between items-center pointer-events-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-[#F8F7F4] border border-[#E7E5DF] text-[#142544] hover:text-[#C58A19] transition-all text-xs font-semibold shadow-xs pointer-events-auto cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#C58A19]" />
          <span>Back to Home</span>
        </Link>
      </header>

      <main className="grow flex items-center justify-center p-4 sm:p-6 relative z-10 pb-16">
        <div className="w-full max-w-md space-y-6">
          {/* Logo Brand Header */}
          <div className="flex flex-col items-center text-center">
            <Link href="/" className="inline-block group mb-3">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 p-1 bg-gradient-to-br from-[#C58A19] to-[#9A680C] rounded-2xl shadow-sm transition-transform group-hover:scale-105 flex items-center justify-center">
                <div className="w-full h-full bg-[#142544] rounded-[13px] p-2 flex items-center justify-center overflow-hidden">
                  <Image
                    src="/images/logo.png"
                    alt="Triumphant Harmony Brass Logo"
                    width={60}
                    height={60}
                    className="w-full h-full object-contain"
                    priority
                  />
                </div>
              </div>
            </Link>
            <span className="text-xl sm:text-2xl font-heading font-bold text-[#142544] tracking-tight">
              Triumphant Harmony Brass
            </span>
            <span className="text-[11px] text-[#C58A19] font-bold uppercase tracking-[0.2em] mt-1 font-sans">
              Music Academy &bull; Lagos
            </span>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
