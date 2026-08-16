'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/programs', label: 'Programs' },
  { href: '/stage-performances', label: 'Stage Performances' },
  { href: '/events', label: 'Events' },
  { href: '/contact', label: 'Contact Us' },
];

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsMobileMenuOpen(false);
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-navy-950/95 backdrop-blur-xl border-b border-navy-800/80 shadow-2xl py-2'
          : 'bg-gradient-to-b from-navy-950/95 via-navy-950/70 to-transparent py-3'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20 gap-3">
          {/* Official THB Logo */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl p-0.5 bg-gradient-to-br from-brand-400 to-amber-600 shadow-glow transition-transform group-hover:scale-105 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-navy-950 rounded-[10px] p-1 flex items-center justify-center overflow-hidden">
                <Image
                  src="/images/logo.png"
                  alt="Triumphant Harmony Brass Logo"
                  width={44}
                  height={44}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-heading font-bold text-xs sm:text-base lg:text-lg leading-tight tracking-tight group-hover:text-brand-400 transition-colors">
                Triumphant Harmony Brass
              </span>
              <span className="text-brand-400 text-[8px] sm:text-[10px] font-bold tracking-widest uppercase">
                Music Academy
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1 bg-navy-900/80 border border-navy-800/80 p-1.5 rounded-full backdrop-blur-md shrink-0">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3.5 py-1.5 rounded-full text-xs xl:text-sm font-semibold transition-all duration-200 whitespace-nowrap',
                  pathname === link.href
                    ? 'text-white bg-brand-500 font-bold shadow-md'
                    : 'text-navy-200 hover:text-white hover:bg-navy-800/80'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons & Theme Toggle (Desktop) */}
          <div className="hidden xl:flex items-center gap-2.5 shrink-0">
            <ThemeToggle />
            <Link
              href="/login"
              className="px-3.5 py-2 text-xs xl:text-sm font-semibold text-slate-200 hover:text-white transition-colors whitespace-nowrap"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-brand-500 hover:bg-brand-400 text-white font-bold rounded-xl text-xs xl:text-sm transition-all shadow-glow whitespace-nowrap"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile / Tablet Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden p-2.5 rounded-xl bg-navy-900/80 border border-navy-800 text-slate-200 hover:text-white cursor-pointer shrink-0"
            aria-label="Toggle navigation menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile / Tablet Navigation Dropdown */}
      <div
        className={cn(
          'xl:hidden transition-all duration-300 overflow-y-auto',
          isMobileMenuOpen ? 'max-h-[85vh] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="bg-navy-900/95 backdrop-blur-xl border-t border-navy-800/80 px-4 pt-4 pb-6 space-y-2 shadow-2xl">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'block px-4 py-3 rounded-xl text-sm font-semibold transition-colors',
                pathname === link.href
                  ? 'text-white bg-brand-500 font-bold'
                  : 'text-slate-200 hover:text-white hover:bg-navy-800/80'
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-navy-800/80 space-y-3">
            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-xs text-navy-400 font-medium">Theme Preference</span>
              <ThemeToggle />
            </div>
            <Link
              href="/login"
              className="block px-4 py-3 text-center text-sm font-semibold text-slate-200 hover:text-white rounded-xl border border-navy-700 bg-navy-950/60"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="block px-4 py-3 text-center bg-brand-500 text-white rounded-xl text-sm font-bold hover:bg-brand-400 shadow-glow"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
