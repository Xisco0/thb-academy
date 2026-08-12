'use client';

import React from 'react';

interface AdminTopBarProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function AdminTopBar({ title, description, actions }: AdminTopBarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-heading font-bold text-white">{title}</h1>
        {description && (
          <p className="text-navy-400 text-sm mt-1">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
