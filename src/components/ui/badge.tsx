import React from 'react';
import { cn } from '@/lib/utils';

const badgeVariants = {
  success: 'bg-green-500/15 text-green-400 border-green-500/25',
  warning: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  danger: 'bg-red-500/15 text-red-400 border-red-500/25',
  info: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
  default: 'bg-navy-600/50 text-navy-300 border-navy-500/25',
  gold: 'bg-brand-500/15 text-brand-400 border-brand-500/25',
};

export interface BadgeProps {
  variant?: keyof typeof badgeVariants;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        badgeVariants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
