'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, CheckCircle2, XCircle, Loader2, BookOpen, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatCurrency } from '@/lib/utils';
import { updateEnrollmentStatusAction } from '@/lib/actions/admin-actions';

interface EnrollmentProps {
  id: string;
  status: string;
  price_at_enrollment: number;
  created_at: string;
  student?: {
    profile?: {
      first_name: string;
      last_name: string;
      email: string;
    };
  };
  course?: { name: string; level?: string };
  instructor?: { first_name: string; last_name: string };
  venue?: { name: string };
}

export function EnrollmentsClient({ enrollments }: { enrollments: EnrollmentProps[] }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filtered = enrollments.filter((e) => {
    const studentName = `${e.student?.profile?.first_name || ''} ${e.student?.profile?.last_name || ''}`.toLowerCase();
    const courseName = (e.course?.name || '').toLowerCase();
    const email = (e.student?.profile?.email || '').toLowerCase();

    const matchesSearch = studentName.includes(search.toLowerCase()) || courseName.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  async function handleStatusUpdate(id: string, status: string) {
    setLoadingId(id);
    await updateEnrollmentStatusAction(id, status);
    setLoadingId(null);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-navy-900/80 border border-navy-800 p-4 rounded-2xl">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-navy-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search enrollments by student or course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-navy-950/80 border border-navy-700/60 rounded-xl text-sm text-white placeholder:text-navy-400 focus:border-brand-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-navy-950/80 border border-navy-700/60 rounded-xl text-sm text-white focus:border-brand-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-navy-900/80 border border-navy-800 rounded-2xl overflow-hidden shadow-xl">
        {filtered.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <BookOpen className="w-12 h-12 text-navy-400 mx-auto opacity-50" />
            <p className="text-lg font-semibold text-white">No enrollments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-navy-950/80 text-xs font-semibold uppercase tracking-wider text-navy-300 border-b border-navy-800">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Course</th>
                  <th className="px-6 py-4">Tuition Fee</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Enrollment Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800/60 text-sm">
                {filtered.map((e) => {
                  const p = (e.student?.profile || {}) as { first_name?: string; last_name?: string; email?: string };
                  return (
                    <tr key={e.id} className="hover:bg-navy-800/40 transition-colors">
                      <td className="px-6 py-4 font-semibold text-white">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-brand-400" />
                          <div>
                            <p>{p.first_name || 'Student'} {p.last_name || ''}</p>
                            <p className="text-xs font-normal text-navy-300">{p.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-brand-300">
                        <p>{e.course?.name || 'Music Program'}</p>
                        {e.course?.level && (
                          <span className="text-[11px] font-normal text-navy-400 uppercase tracking-wider block mt-0.5">
                            Level: {e.course.level.replace('_', ' ')}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-white font-bold">{formatCurrency(e.price_at_enrollment || 0)}</td>
                      <td className="px-6 py-4">
                        <Badge variant={e.status === 'active' ? 'default' : e.status === 'pending' ? 'info' : 'default'}>
                          {e.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-navy-300">{formatDate(e.created_at)}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {e.status !== 'active' && (
                          <button
                            onClick={() => handleStatusUpdate(e.id, 'active')}
                            disabled={loadingId === e.id}
                            className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg text-xs transition-colors inline-flex items-center gap-1 shadow-sm"
                          >
                            {loadingId === e.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                            <span>Approve</span>
                          </button>
                        )}
                        {e.status !== 'cancelled' && (
                          <button
                            onClick={() => handleStatusUpdate(e.id, 'cancelled')}
                            disabled={loadingId === e.id}
                            className="px-3 py-1.5 bg-red-600/80 hover:bg-red-500 text-white font-bold rounded-lg text-xs transition-colors inline-flex items-center gap-1 shadow-sm"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Cancel</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
