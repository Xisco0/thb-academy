'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { LogOut, Menu, X, Bell } from 'lucide-react';

import { useSessionAuth } from '@/components/auth/session-inactivity-provider';

export function NavBar({ user }: { user: any }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { confirmLogout } = useSessionAuth();

  const links = [
    { name: 'Dashboard', href: '/student' },
    { name: 'Enrollments', href: '/student/enrollments' },
    { name: 'Payments', href: '/student/payments' },
    { name: 'Notifications', href: '/student/notifications' },
    { name: 'Profile', href: '/student/profile' },
  ];

  const handleLogout = () => {
    confirmLogout();
  };

  const name = user?.user_metadata?.first_name || user?.email || 'Student';
  const initials = name.substring(0, 2).toUpperCase();

  return (
    <nav className="bg-navy-900 border-b border-navy-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="relative w-8 h-8 rounded-lg p-0.5 bg-gradient-to-br from-brand-400 to-amber-600 flex items-center justify-center overflow-hidden shrink-0">
                  <Image
                    src="/images/logo.png"
                    alt="THB Logo"
                    width={28}
                    height={28}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-lg font-heading font-bold text-white hidden sm:block">THB Academy</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium transition-colors border-b-2 mt-0.5 ${
                      isActive 
                        ? 'border-brand-400 text-white' 
                        : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:gap-4">
            <Link href="/student/notifications" className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-navy-800 transition-colors">
              <Bell className="w-5 h-5" />
            </Link>
            
            <div className="flex items-center gap-3 pl-4 border-l border-navy-800">
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-white">{name}</span>
                <span className="text-xs text-slate-400">Student</span>
              </div>
              <div className="h-9 w-9 rounded-full bg-brand-500/20 border border-brand-500/50 flex items-center justify-center text-brand-400 font-semibold text-sm">
                {initials}
              </div>
              <button
                onClick={handleLogout}
                className="ml-2 text-slate-400 hover:text-danger-400 p-2 rounded-lg hover:bg-navy-800 transition-colors"
                title="Log out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden border-t border-navy-800 bg-navy-900">
          <div className="pt-2 pb-3 space-y-1">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    isActive
                      ? 'bg-brand-500/10 border-brand-400 text-white'
                      : 'border-transparent text-slate-400 hover:bg-navy-800 hover:text-slate-200'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
          <div className="pt-4 pb-3 border-t border-navy-800">
            <div className="flex items-center px-4 gap-3">
              <div className="h-10 w-10 rounded-full bg-brand-500/20 border border-brand-500/50 flex items-center justify-center text-brand-400 font-semibold">
                {initials}
              </div>
              <div>
                <div className="text-base font-medium text-white">{name}</div>
                <div className="text-sm font-medium text-slate-400">{user?.email}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-base font-medium text-slate-400 hover:text-white hover:bg-navy-800"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
