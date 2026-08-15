'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField?: string;
  searchPlaceholder?: string;
  searchFields?: string[];
  emptyTitle?: string;
  emptyDescription?: string;
  createHref?: string;
  createLabel?: string;
  onRowClick?: (item: T) => void;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  keyField = 'id',
  searchPlaceholder = 'Search...',
  searchFields = [],
  emptyTitle = 'No data found',
  emptyDescription = 'Get started by creating a new entry.',
  createHref,
  createLabel = 'Create New',
  onRowClick,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');

  const filtered = search.trim()
    ? data.filter((item) =>
        searchFields.some((field) => {
          const value = item[field];
          return typeof value === 'string' && value.toLowerCase().includes(search.toLowerCase());
        })
      )
    : data;

  return (
    <div>
      {/* Search Bar */}
      {searchFields.length > 0 && (
        <div className="mb-4">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-sm px-4 py-2.5 bg-navy-800 border border-navy-700/50 rounded-lg text-navy-100 text-sm placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500"
          />
        </div>
      )}

      {/* Table */}
      <div className="bg-navy-800/50 border border-navy-700/30 rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg font-semibold text-navy-200 mb-1">{emptyTitle}</p>
            <p className="text-navy-400 text-sm mb-6">{emptyDescription}</p>
            {createHref && (
              <Link
                href={createHref}
                className="inline-flex items-center px-4 py-2 bg-brand-500 text-white font-bold rounded-lg text-sm font-semibold hover:bg-brand-400 transition-colors"
              >
                {createLabel}
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-navy-700/30">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={cn(
                        'px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-navy-400',
                        col.className
                      )}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-700/20">
                {filtered.map((item) => (
                  <tr
                    key={String(item[keyField])}
                    onClick={() => onRowClick?.(item)}
                    className={cn(
                      'transition-colors',
                      onRowClick
                        ? 'cursor-pointer hover:bg-navy-700/30'
                        : 'hover:bg-navy-800/30'
                    )}
                  >
                    {columns.map((col) => (
                      <td key={col.key} className={cn('px-6 py-4 text-sm text-navy-200', col.className)}>
                        {col.render ? col.render(item) : String(item[col.key] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Count */}
      {filtered.length > 0 && (
        <p className="text-navy-500 text-xs mt-3">
          Showing {filtered.length} of {data.length} {data.length === 1 ? 'record' : 'records'}
        </p>
      )}
    </div>
  );
}
