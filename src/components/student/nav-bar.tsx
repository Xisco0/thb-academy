'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { LogOut, Menu, X, Bell, User } from 'lucide-react';
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
    <nav className="bg-white/95 backdrop-blur-md border-b border-[#E7E5DF] sticky top-0 z-50 shadow-[0_2px_12px_-2px_rgba(20,37,68,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="relative w-8 h-8 rounded-lg p-0.5 bg-gradient-to-br from-[#C58A19] to-[#9A680C] flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                  <div className="w-full h-full bg-[#142544] rounded-[6px] p-0.5 flex items-center justify-center overflow-hidden">
                    <Image
                      src="/images/logo.png"
                      alt="THB Logo"
                      width={24}
                      height={24}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-heading font-bold text-[#142544] leading-tight">
                    THB Academy
                  </span>
                  <span className="text-[9px] font-bold text-[#C58A19] uppercase tracking-wider font-sans">
                    Student Portal
                  </span>
                </div>
              </Link>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`inline-flex items-center px-3.5 py-2 text-sm font-semibold transition-colors border-b-2 mt-0.5 ${
                      isActive 
                        ? 'border-[#C58A19] text-[#142544] font-bold' 
                        : 'border-transparent text-[#647084] hover:text-[#142544] hover:border-[#E7E5DF]'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:gap-4">
            <Link
              href="/student/notifications"
              className="text-[#647084] hover:text-[#142544] p-2 rounded-full hover:bg-[#F8F7F4] transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
            </Link>
            
            <div className="flex items-center gap-3 pl-4 border-l border-[#E7E5DF]">
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-[#142544] leading-tight">{name}</span>
                <span className="text-[10px] text-[#C58A19] font-semibold uppercase tracking-wider">Enrolled Student</span>
              </div>
              <div className="h-9 w-9 rounded-full bg-[#F8EBCB] border border-[#C58A19]/30 flex items-center justify-center text-[#9A680C] font-bold text-xs shadow-xs">
                {initials}
              </div>
              <button
                onClick={handleLogout}
                className="ml-2 text-[#647084] hover:text-[#C74646] p-2 rounded-lg hover:bg-[#F8F7F4] transition-colors cursor-pointer"
                title="Log out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-[#142544] hover:bg-[#F8F7F4] border border-[#E7E5DF] cursor-pointer"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="block h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden border-t border-[#E7E5DF] bg-white shadow-xl animate-slide-down">
          <div className="pt-2 pb-3 space-y-1 px-4">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-semibold ${
                    isActive
                      ? 'bg-[#F8EBCB] text-[#9A680C] font-bold'
                      : 'text-[#17243A] hover:bg-[#F8F7F4]'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
          <div className="pt-4 pb-4 border-t border-[#E7E5DF] px-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#F8EBCB] border border-[#C58A19]/30 flex items-center justify-center text-[#9A680C] font-bold text-sm">
                {initials}
              </div>
              <div>
                <div className="text-sm font-bold text-[#142544]">{name}</div>
                <div className="text-xs text-[#647084] truncate">{user?.email}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="block w-full text-center px-4 py-2.5 rounded-full text-sm font-semibold text-[#C74646] bg-[#C74646]/10 hover:bg-[#C74646]/20 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
