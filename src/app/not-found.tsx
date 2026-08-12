import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="flex justify-center mb-8 text-brand-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-pulse text-brand-400"
          >
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        </div>
        
        <h1 className="text-8xl font-heading font-bold text-transparent bg-clip-text bg-linear-to-r from-brand-400 to-[#e5a83a]">
          404
        </h1>
        
        <h2 className="text-3xl font-heading font-semibold text-white">
          Page Not Found
        </h2>
        
        <p className="text-gray-400 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <div className="pt-8">
          <Link 
            href="/"
            className="inline-block px-8 py-3 bg-brand-400 text-navy-950 font-semibold rounded-md hover:bg-opacity-90 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
