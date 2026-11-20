'use client';

import React from 'react';
import { cn } from '@/lib/utils';

const variants = {
  primary:
    'bg-[#142544] text-white hover:bg-[#243653] active:bg-[#0e1b32] font-semibold shadow-sm hover:shadow-md',
  gold:
    'bg-[#C58A19] text-white hover:bg-[#b07b14] active:bg-[#9a680c] font-semibold shadow-[0_2px_10px_rgba(197,138,25,0.25)] hover:shadow-[0_4px_16px_rgba(197,138,25,0.35)]',
  secondary:
    'bg-[#F8F7F4] text-[#142544] border border-[#E7E5DF] hover:bg-[#F5F0E6] hover:border-[#d5d2c8] font-medium',
  outline:
    'bg-transparent border border-[#C58A19] text-[#C58A19] hover:bg-[#F8EBCB]/40 hover:text-[#9a680c] font-medium',
  ghost:
    'bg-transparent text-[#17243A] hover:bg-[#F8F7F4] hover:text-[#142544] font-medium',
  danger:
    'bg-[#C74646] text-white hover:bg-[#b03a3a] active:bg-[#992f2f] font-semibold',
};

const sizes = {
  sm: 'px-3.5 py-1.5 text-xs rounded-full gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-full gap-2',
  lg: 'px-7 py-3.5 text-base rounded-full gap-2.5',
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center transition-all duration-200 cursor-pointer select-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C58A19] focus-visible:ring-offset-2 focus-visible:ring-offset-white',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-4 w-4"
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
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
