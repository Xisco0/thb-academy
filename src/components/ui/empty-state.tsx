import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({ icon, title, description, actionLabel, onAction, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center bg-[#F8F7F4]/60 rounded-2xl border border-dashed border-[#E7E5DF]', className)}>
      {icon && <div className="text-[#C58A19] mb-4 p-4 rounded-full bg-[#F8EBCB]/50">{icon}</div>}
      <h3 className="text-lg font-heading font-semibold text-[#142544] mb-1">{title}</h3>
      {description && <p className="text-[#647084] text-sm max-w-md mb-6">{description}</p>}
      {actionLabel && onAction && (
        <Button variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
