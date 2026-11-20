import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#142544] flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-lg bg-white border border-[#E7E5DF] p-10 sm:p-12 rounded-3xl shadow-sm">
        <div className="flex justify-center mb-2">
          <div className="w-16 h-16 rounded-2xl bg-[#F5F0E6] border border-[#C58A19]/30 flex items-center justify-center text-[#C58A19]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#C58A19]"
            >
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-7xl sm:text-8xl font-heading font-bold text-[#C58A19]">
          404
        </h1>
        
        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#142544]">
          Page Not Found
        </h2>
        
        <p className="text-[#647084] text-sm max-w-sm mx-auto leading-relaxed">
          The music academy page you are looking for might have been moved, renamed, or is temporarily unavailable.
        </p>
        
        <div className="pt-4">
          <Link 
            href="/"
            className="inline-flex items-center px-8 py-3 bg-[#142544] hover:bg-[#243653] text-white font-semibold rounded-full transition-all shadow-sm text-sm"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
