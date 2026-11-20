'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-semibold text-[#142544] uppercase tracking-wider mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full px-4 py-2.5 bg-white border rounded-xl text-[#17243A] text-sm appearance-none pr-10',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-[#C58A19]/30 focus:border-[#C58A19]',
              'disabled:opacity-50 disabled:bg-[#F8F7F4] disabled:cursor-not-allowed',
              error
                ? 'border-[#C74646] focus:ring-[#C74646]/20'
                : 'border-[#E7E5DF] hover:border-[#CBD5E1]',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#647084]">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error && <p className="mt-1.5 text-xs text-[#C74646] font-medium">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
