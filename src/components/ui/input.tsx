'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-[#142544] uppercase tracking-wider mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#647084]">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full px-4 py-2.5 bg-white border rounded-xl text-[#17243A] text-sm',
              'placeholder:text-[#8896AB]',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-[#C58A19]/30 focus:border-[#C58A19]',
              'disabled:opacity-50 disabled:bg-[#F8F7F4] disabled:cursor-not-allowed',
              error
                ? 'border-[#C74646] focus:ring-[#C74646]/20 focus:border-[#C74646]'
                : 'border-[#E7E5DF] hover:border-[#CBD5E1]',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#647084]">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-[#C74646] font-medium">{error}</p>}
        {helperText && !error && <p className="mt-1.5 text-xs text-[#647084]">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
