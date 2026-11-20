import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export function Card({ children, className, hover = false, glow = false }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white border border-[#E7E5DF] rounded-2xl shadow-[0_2px_12px_-2px_rgba(20,37,68,0.05)]',
        hover && 'transition-all duration-300 hover:shadow-[0_12px_28px_-4px_rgba(20,37,68,0.1)] hover:border-[#C58A19]/40 hover:-translate-y-1',
        glow && 'shadow-[0_0_25px_rgba(197,138,25,0.18)]',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-4 border-b border-[#E7E5DF]', className)}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('px-6 py-5', className)}>{children}</div>;
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-4 border-t border-[#E7E5DF] bg-[#F8F7F4]/50 rounded-b-2xl', className)}>
      {children}
    </div>
  );
}
