import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[45%] h-[45%] rounded-full bg-brand-500/10 blur-[130px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[45%] h-[45%] rounded-full bg-navy-600/20 blur-[130px]" />
      </div>

      {/* Header bar with fixed functional Back to Home link */}
      <header className="relative z-50 w-full p-6 max-w-7xl mx-auto flex justify-between items-center pointer-events-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-navy-900/80 hover:bg-navy-800 border border-navy-700/60 text-navy-200 hover:text-brand-400 transition-all text-sm font-semibold shadow-md pointer-events-auto cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-brand-500" />
          <span>Back to Home</span>
        </Link>
      </header>

      <main className="grow flex items-center justify-center p-4 sm:p-6 relative z-10">
        <div className="w-full max-w-md space-y-6">
          {/* Logo Brand Header */}
          <div className="flex flex-col items-center text-center">
            <Link href="/" className="inline-block group mb-3">
              <div className="relative w-20 h-20 p-1 bg-linear-to-br from-brand-400 to-amber-600 rounded-2xl shadow-glow transition-transform group-hover:scale-105 flex items-center justify-center">
                <div className="w-full h-full bg-navy-950 rounded-[14px] p-2 flex items-center justify-center overflow-hidden">
                  <Image
                    src="/images/logo.png"
                    alt="Triumphant Harmony Brass Logo"
                    width={64}
                    height={64}
                    className="w-full h-full object-contain"
                    priority
                  />
                </div>
              </div>
            </Link>
            <span className="text-xl font-heading font-bold text-white tracking-wide">
              Triumphant Harmony Brass
            </span>
            <span className="text-xs text-brand-400 font-medium uppercase tracking-widest mt-1">
              Music Academy • Lagos
            </span>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
