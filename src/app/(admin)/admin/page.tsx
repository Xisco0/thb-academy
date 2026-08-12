import React from 'react';
import Link from 'next/link';
import { getDashboardStats, getRecentEnrollments, getRecentPayments } from '@/lib/queries/admin';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Dashboard | Admin' };

const statCards = [
  { key: 'totalStudents', label: 'Total Students', icon: '👥', color: 'from-blue-500/20 to-blue-600/10 border-blue-500/20', href: '/admin/students' },
  { key: 'activeCourses', label: 'Active Courses', icon: '📚', color: 'from-green-500/20 to-green-600/10 border-green-500/20', href: '/admin/courses' },
  { key: 'activeEnrollments', label: 'Active Enrollments', icon: '📋', color: 'from-purple-500/20 to-purple-600/10 border-purple-500/20', href: '/admin/enrollments' },
  { key: 'publishedEvents', label: 'Published Events', icon: '🎵', color: 'from-brand-500/20 to-brand-600/10 border-brand-500/20', href: '/admin/events' },
  { key: 'pendingPayments', label: 'Pending Payments', icon: '💰', color: 'from-amber-500/20 to-amber-600/10 border-amber-500/20', href: '/admin/payments' },
];

export default async function AdminDashboard() {
  const [stats, recentEnrollments, recentPayments] = await Promise.all([
    getDashboardStats(),
    getRecentEnrollments(5),
    getRecentPayments(5),
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-white">Dashboard</h1>
        <p className="text-navy-400 text-sm mt-1">Welcome back. Here&apos;s an overview of your academy.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-10">
        {statCards.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            className={`bg-gradient-to-br ${card.color} border rounded-xl p-5 hover:-translate-y-0.5 transition-all duration-200`}
          >
            <div className="text-2xl mb-2">{card.icon}</div>
            <p className="text-2xl font-bold text-white">
              {stats[card.key as keyof typeof stats]}
            </p>
            <p className="text-navy-300 text-sm mt-1">{card.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Enrollments */}
        <div className="bg-navy-800/50 border border-navy-700/30 rounded-xl">
          <div className="px-6 py-4 border-b border-navy-700/30 flex items-center justify-between">
            <h2 className="text-white font-semibold">Recent Enrollments</h2>
            <Link href="/admin/enrollments" className="text-brand-400 text-sm hover:text-brand-300">
              View All
            </Link>
          </div>
          <div className="divide-y divide-navy-700/20">
            {recentEnrollments.length === 0 ? (
              <p className="px-6 py-8 text-center text-navy-400 text-sm">No enrollments yet</p>
            ) : (
              recentEnrollments.map((enrollment: Record<string, unknown>) => {
                const student = enrollment.student as Record<string, unknown> | null;
                const profile = student?.profile as Record<string, unknown> | null;
                const course = enrollment.course as Record<string, unknown> | null;
                return (
                  <div key={String(enrollment.id)} className="px-6 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-medium">
                        {profile ? `${profile.first_name} ${profile.last_name}` : 'Unknown'}
                      </p>
                      <p className="text-navy-400 text-xs">{course ? String(course.name) : 'Unknown Course'}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        enrollment.status === 'active' ? 'bg-green-500/15 text-green-400' :
                        enrollment.status === 'pending' ? 'bg-amber-500/15 text-amber-400' :
                        'bg-navy-600/50 text-navy-300'
                      }`}>
                        {String(enrollment.status)}
                      </span>
                      <p className="text-navy-500 text-xs mt-1">{formatDate(String(enrollment.created_at))}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-navy-800/50 border border-navy-700/30 rounded-xl">
          <div className="px-6 py-4 border-b border-navy-700/30 flex items-center justify-between">
            <h2 className="text-white font-semibold">Recent Payments</h2>
            <Link href="/admin/payments" className="text-brand-400 text-sm hover:text-brand-300">
              View All
            </Link>
          </div>
          <div className="divide-y divide-navy-700/20">
            {recentPayments.length === 0 ? (
              <p className="px-6 py-8 text-center text-navy-400 text-sm">No payments yet</p>
            ) : (
              recentPayments.map((payment: Record<string, unknown>) => {
                const student = payment.student as Record<string, unknown> | null;
                const profile = student?.profile as Record<string, unknown> | null;
                return (
                  <div key={String(payment.id)} className="px-6 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-medium">
                        {profile ? `${profile.first_name} ${profile.last_name}` : 'Unknown'}
                      </p>
                      <p className="text-navy-400 text-xs">{formatCurrency(Number(payment.amount))}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        payment.status === 'approved' ? 'bg-green-500/15 text-green-400' :
                        payment.status === 'pending' ? 'bg-amber-500/15 text-amber-400' :
                        payment.status === 'rejected' ? 'bg-red-500/15 text-red-400' :
                        'bg-navy-600/50 text-navy-300'
                      }`}>
                        {String(payment.status)}
                      </span>
                      <p className="text-navy-500 text-xs mt-1">{formatDate(String(payment.created_at))}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
