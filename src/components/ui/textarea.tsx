'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="block text-xs font-semibold text-[#142544] uppercase tracking-wider mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full px-4 py-2.5 bg-white border rounded-xl text-[#17243A] text-sm',
            'placeholder:text-[#8896AB]',
            'transition-all duration-200 resize-y min-h-[100px]',
            'focus:outline-none focus:ring-2 focus:ring-[#C58A19]/30 focus:border-[#C58A19]',
            'disabled:opacity-50 disabled:bg-[#F8F7F4] disabled:cursor-not-allowed',
            error
              ? 'border-[#C74646] focus:ring-[#C74646]/20 focus:border-[#C74646]'
              : 'border-[#E7E5DF] hover:border-[#CBD5E1]',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-[#C74646] font-medium">{error}</p>}
        {helperText && !error && <p className="mt-1.5 text-xs text-[#647084]">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
