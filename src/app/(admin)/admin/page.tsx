import React from 'react';
import Link from 'next/link';
import { getDashboardStats, getRecentEnrollments, getRecentPayments } from '@/lib/queries/admin';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Users, BookOpen, ClipboardList, Calendar, CreditCard, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Dashboard | Admin' };

const statCards = [
  { key: 'totalStudents', label: 'Total Students', Icon: Users, bg: 'bg-[#F8F7F4] border-[#E7E5DF]', iconColor: 'text-[#142544]', href: '/admin/students' },
  { key: 'activeCourses', label: 'Active Courses', Icon: BookOpen, bg: 'bg-[#F8F7F4] border-[#E7E5DF]', iconColor: 'text-[#C58A19]', href: '/admin/courses' },
  { key: 'activeEnrollments', label: 'Active Enrollments', Icon: ClipboardList, bg: 'bg-[#F8F7F4] border-[#E7E5DF]', iconColor: 'text-[#23845B]', href: '/admin/enrollments' },
  { key: 'publishedEvents', label: 'Published Events', Icon: Calendar, bg: 'bg-[#F8F7F4] border-[#E7E5DF]', iconColor: 'text-[#243653]', href: '/admin/events' },
  { key: 'pendingPayments', label: 'Pending Payments', Icon: CreditCard, bg: 'bg-[#F5F0E6] border-[#C58A19]/30', iconColor: 'text-[#C58A19]', href: '/admin/payments' },
];

export default async function AdminDashboard() {
  const [stats, recentEnrollments, recentPayments] = await Promise.all([
    getDashboardStats(),
    getRecentEnrollments(5),
    getRecentPayments(5),
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#142544] tracking-tight">Dashboard Overview</h1>
        <p className="text-[#647084] text-sm mt-1">Welcome back. Here&apos;s a live summary of academy operations and student activity.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((card) => {
          const IconComponent = card.Icon;
          return (
            <Link
              key={card.key}
              href={card.href}
              className={`bg-white border ${card.bg} rounded-2xl p-5 hover:shadow-md transition-all duration-200 group`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-[#F8F7F4] border border-[#E7E5DF] flex items-center justify-center ${card.iconColor}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-[#8896AB] group-hover:text-[#C58A19] group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-2xl font-bold text-[#142544] font-heading">
                {stats[card.key as keyof typeof stats]}
              </p>
              <p className="text-[#647084] text-xs font-medium mt-1">{card.label}</p>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Enrollments */}
        <div className="bg-white border border-[#E7E5DF] rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E7E5DF] bg-[#F8F7F4]/50 flex items-center justify-between">
            <h2 className="text-[#142544] font-bold font-heading text-sm">Recent Enrollments</h2>
            <Link href="/admin/enrollments" className="text-[#C58A19] text-xs font-semibold hover:text-[#A37013] transition-colors">
              View All &rarr;
            </Link>
          </div>
          <div className="divide-y divide-[#E7E5DF]">
            {recentEnrollments.length === 0 ? (
              <p className="px-6 py-8 text-center text-[#8896AB] text-xs">No enrollments yet</p>
            ) : (
              recentEnrollments.map((enrollment: Record<string, unknown>) => {
                const student = enrollment.student as Record<string, unknown> | null;
                const profile = student?.profile as Record<string, unknown> | null;
                const course = enrollment.course as Record<string, unknown> | null;
                return (
                  <div key={String(enrollment.id)} className="px-6 py-3.5 flex items-center justify-between hover:bg-[#F8F7F4]/50 transition-colors">
                    <div>
                      <p className="text-[#142544] text-sm font-semibold">
                        {profile ? `${profile.first_name} ${profile.last_name}` : 'Unknown'}
                      </p>
                      <p className="text-[#647084] text-xs">{course ? String(course.name) : 'Unknown Course'}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        enrollment.status === 'active' ? 'bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]' :
                        enrollment.status === 'pending' ? 'bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]' :
                        'bg-[#F8F7F4] text-[#647084] border border-[#E7E5DF]'
                      }`}>
                        {String(enrollment.status)}
                      </span>
                      <p className="text-[#8896AB] text-[11px] mt-1">{formatDate(String(enrollment.created_at))}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white border border-[#E7E5DF] rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E7E5DF] bg-[#F8F7F4]/50 flex items-center justify-between">
            <h2 className="text-[#142544] font-bold font-heading text-sm">Recent Payments</h2>
            <Link href="/admin/payments" className="text-[#C58A19] text-xs font-semibold hover:text-[#A37013] transition-colors">
              View All &rarr;
            </Link>
          </div>
          <div className="divide-y divide-[#E7E5DF]">
            {recentPayments.length === 0 ? (
              <p className="px-6 py-8 text-center text-[#8896AB] text-xs">No payments yet</p>
            ) : (
              recentPayments.map((payment: Record<string, unknown>) => {
                const student = payment.student as Record<string, unknown> | null;
                const profile = student?.profile as Record<string, unknown> | null;
                return (
                  <div key={String(payment.id)} className="px-6 py-3.5 flex items-center justify-between hover:bg-[#F8F7F4]/50 transition-colors">
                    <div>
                      <p className="text-[#142544] text-sm font-semibold">
                        {profile ? `${profile.first_name} ${profile.last_name}` : 'Unknown'}
                      </p>
                      <p className="text-[#C58A19] text-xs font-bold">{formatCurrency(Number(payment.amount))}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        payment.status === 'approved' ? 'bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]' :
                        payment.status === 'pending' ? 'bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]' :
                        payment.status === 'rejected' ? 'bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]' :
                        'bg-[#F8F7F4] text-[#647084] border border-[#E7E5DF]'
                      }`}>
                        {String(payment.status)}
                      </span>
                      <p className="text-[#8896AB] text-[11px] mt-1">{formatDate(String(payment.created_at))}</p>
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
