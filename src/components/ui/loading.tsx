import React from 'react';
import { cn } from '@/lib/utils';

export function Spinner({ className, size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' };
  return (
    <svg
      className={cn('animate-spin text-brand-500', sizeClasses[size], className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <Spinner size="lg" className="mx-auto mb-4" />
        <p className="text-navy-400 text-sm">Loading...</p>
      </div>
    </div>
  );
}

export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-navy-800/50 border border-navy-700/30 rounded-xl p-6 animate-pulse">
          <div className="h-40 bg-navy-700/50 rounded-lg mb-4" />
          <div className="h-4 bg-navy-700/50 rounded w-3/4 mb-2" />
          <div className="h-3 bg-navy-700/50 rounded w-1/2 mb-4" />
          <div className="h-8 bg-navy-700/50 rounded w-1/3" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-navy-800/50 border border-navy-700/30 rounded-xl overflow-hidden animate-pulse">
      <div className="px-6 py-3 border-b border-navy-700/30">
        <div className="flex gap-4">
          {Array.from({ length: cols }).map((_, i) => (
            <div key={i} className="h-4 bg-navy-700/50 rounded flex-1" />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="px-6 py-4 border-b border-navy-700/20 last:border-0">
          <div className="flex gap-4">
            {Array.from({ length: cols }).map((_, j) => (
              <div key={j} className="h-3 bg-navy-700/30 rounded flex-1" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
