'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';
import { Menu, X, LogOut } from 'lucide-react';
import { useSessionAuth } from '@/components/auth/session-inactivity-provider';

interface AdminSidebarProps {
  user: { email: string; firstName: string; lastName: string };
}

const navSections = [
  {
    title: 'Overview',
    items: [
      { href: '/admin', label: 'Dashboard', icon: 'grid' },
    ],
  },
  {
    title: 'Academy Management',
    items: [
      { href: '/admin/students', label: 'Students', icon: 'users' },
      { href: '/admin/instructors', label: 'Instructors', icon: 'mic' },
      { href: '/admin/instruments', label: 'Instruments', icon: 'music' },
      { href: '/admin/courses', label: 'Courses', icon: 'book' },
      { href: '/admin/enrollments', label: 'Enrollments', icon: 'clipboard' },
      { href: '/admin/payments', label: 'Payments', icon: 'credit-card' },
      { href: '/admin/schedules', label: 'Schedules', icon: 'calendar' },
      { href: '/admin/venues', label: 'Venues', icon: 'map' },
    ],
  },
  {
    title: 'Performances & Media',
    items: [
      { href: '/admin/content', label: 'Performance Gallery', icon: 'camera' },
      { href: '/admin/events', label: 'Events & Activity Photos', icon: 'star' },
    ],
  },
  {
    title: 'System & Settings',
    items: [
      { href: '/admin/notifications', label: 'Notifications', icon: 'bell' },
      { href: '/admin/admins', label: 'Admin Users', icon: 'shield' },
      { href: '/admin/settings', label: 'Settings', icon: 'settings' },
      { href: '/admin/profile', label: 'My Profile', icon: 'user' },
    ],
  },
];

const icons: Record<string, React.ReactNode> = {
  grid: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />,
  users: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />,
  mic: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />,
  music: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />,
  book: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />,
  clipboard: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />,
  'credit-card': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
  calendar: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
  map: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />,
  star: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />,
  camera: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9zM15 13a3 3 0 11-6 0 3 3 0 016 0z" />,
  bell: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />,
  shield: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
  settings: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573" />,
  user: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
};

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const { confirmLogout } = useSessionAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    confirmLogout();
  }

  return (
    <>
      {/* Mobile Bar Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-navy-900 border-b border-navy-800 px-4 z-40 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-white bg-navy-800 border border-navy-700 rounded-xl"
            aria-label="Toggle Navigation Drawer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Link href="/admin" className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="THB Logo" width={28} height={28} className="w-7 h-7 object-contain" />
            <span className="text-white font-heading font-bold text-sm">THB Admin</span>
          </Link>
        </div>

        <ThemeToggle />
      </div>

      {/* Backdrop overlay for mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40 animate-fade-in"
        />
      )}

      {/* Sidebar Navigation Container */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen w-64 bg-navy-900 border-r border-navy-800/80 z-50 flex flex-col transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Top Branding */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-navy-800">
          <Link href="/admin" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
            <div className="relative w-8 h-8 rounded-xl p-0.5 bg-gradient-to-br from-brand-400 to-amber-500 flex items-center justify-center overflow-hidden shrink-0 shadow-glow">
              <Image src="/images/logo.png" alt="THB Logo" width={28} height={28} className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-white font-heading font-bold text-sm block">THB Academy</span>
              <span className="text-[10px] text-brand-400 font-semibold uppercase tracking-wider block">Admin Portal</span>
            </div>
          </Link>

          <button onClick={() => setMobileOpen(false)} className="lg:hidden p-1.5 text-navy-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Section Items */}
        <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-6">
          {navSections.map((section) => (
            <div key={section.title}>
              <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-navy-400 mb-2">
                {section.title}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                        isActive
                          ? 'bg-brand-500/15 text-brand-400 font-bold border border-brand-500/30 shadow-sm'
                          : 'text-navy-200 hover:text-white hover:bg-navy-800/60'
                      )}
                    >
                      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {icons[item.icon]}
                      </svg>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom User Bar & Theme Toggle */}
        <div className="border-t border-navy-800 p-4 space-y-3 bg-navy-950/60">
          <div className="flex items-center justify-between">
            <Link href="/admin/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 group cursor-pointer hover:opacity-90">
              <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/40 text-brand-400 flex items-center justify-center text-xs font-bold shrink-0 group-hover:border-brand-400 transition-colors">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-white text-xs font-bold truncate group-hover:text-brand-400 transition-colors">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-navy-400 text-[10px] truncate">{user.email}</p>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 text-navy-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-2 border-t border-navy-800/60 flex items-center justify-between">
            <span className="text-[11px] text-navy-400 font-medium">Appearance</span>
            <ThemeToggle />
          </div>
        </div>
      </aside>
    </>
  );
}
