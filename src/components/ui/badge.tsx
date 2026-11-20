import React from 'react';
import { cn } from '@/lib/utils';

const badgeVariants = {
  success: 'bg-[#23845B]/10 text-[#23845B] border-[#23845B]/25',
  warning: 'bg-[#C58A19]/10 text-[#A76F14] border-[#C58A19]/30',
  danger: 'bg-[#C74646]/10 text-[#C74646] border-[#C74646]/25',
  info: 'bg-[#142544]/10 text-[#142544] border-[#142544]/20',
  default: 'bg-[#F8F7F4] text-[#647084] border-[#E7E5DF]',
  gold: 'bg-[#F8EBCB] text-[#9A680C] border-[#C58A19]/30 font-semibold',
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
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border tracking-wide',
        badgeVariants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
