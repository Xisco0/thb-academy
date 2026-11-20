'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

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
  searchPlaceholder = 'Search records...',
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
    <div className="space-y-4">
      {/* Search Bar */}
      {searchFields.length > 0 && (
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 text-[#8896AB] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E7E5DF] rounded-xl text-[#142544] text-sm placeholder:text-[#8896AB] focus:outline-none focus:ring-1 focus:ring-[#C58A19] focus:border-[#C58A19] shadow-sm transition-all"
          />
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-[#E7E5DF] rounded-2xl overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <p className="text-base font-bold text-[#142544] font-heading">{emptyTitle}</p>
            <p className="text-[#647084] text-xs max-w-sm mx-auto">{emptyDescription}</p>
            {createHref && (
              <div className="pt-2">
                <Link
                  href={createHref}
                  className="inline-flex items-center px-5 py-2.5 bg-[#C58A19] text-white font-semibold rounded-full text-xs hover:bg-[#A37013] transition-all shadow-sm"
                >
                  {createLabel}
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F7F4] border-b border-[#E7E5DF]">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={cn(
                        'px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[#647084]',
                        col.className
                      )}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E5DF]">
                {filtered.map((item) => (
                  <tr
                    key={String(item[keyField])}
                    onClick={() => onRowClick?.(item)}
                    className={cn(
                      'transition-colors',
                      onRowClick
                        ? 'cursor-pointer hover:bg-[#F8F7F4]/80'
                        : 'hover:bg-[#F8F7F4]/50'
                    )}
                  >
                    {columns.map((col) => (
                      <td key={col.key} className={cn('px-6 py-4 text-sm text-[#142544]', col.className)}>
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
        <p className="text-[#8896AB] text-xs">
          Showing {filtered.length} of {data.length} {data.length === 1 ? 'record' : 'records'}
        </p>
      )}
    </div>
  );
}
