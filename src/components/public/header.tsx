'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Search,
  User,
  ArrowRight,
  ChevronDown,
  Menu,
  X,
  Music,
  BookOpen,
  Award,
  Sparkles,
} from 'lucide-react';

const programCategories = [
  {
    title: 'Brass & Woodwinds',
    desc: 'Trumpet, Saxophone, Trombone, French Horn & Ensemble',
    href: '/programs?category=brass',
    icon: Music,
  },
  {
    title: 'Keyboards & Strings',
    desc: 'Piano, Acoustic/Electric Guitar, Violin, Drums & Voice',
    href: '/programs?category=strings',
    icon: BookOpen,
  },
  {
    title: 'Live Performances',
    desc: 'Stage experience with recitals, concerts & band training',
    href: '/stage-performances',
    icon: Sparkles,
  },
  {
    title: 'Mastery Certificate',
    desc: 'Structured graded curriculum for all skill levels',
    href: '/programs',
    icon: Award,
  },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProgramsOpen, setIsProgramsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const programsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProgramsOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  // Click outside listener for programs dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (programsRef.current && !programsRef.current.contains(event.target as Node)) {
        setIsProgramsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/programs?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-md',
          isScrolled
            ? 'border-b border-[#E7E5DF] shadow-[0_4px_20px_-4px_rgba(20,37,68,0.06)] py-2.5'
            : 'border-b border-[#E7E5DF]/60 py-3.5'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 lg:h-16 gap-3">
            {/* 1. Official Academy Logo & Identity */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl p-0.5 bg-gradient-to-br from-[#C58A19] to-[#9A680C] shadow-sm transition-transform group-hover:scale-105 flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-[#142544] rounded-[10px] p-1 flex items-center justify-center overflow-hidden">
                  <Image
                    src="/images/logo.png"
                    alt="Triumphant Harmony Brass Logo"
                    width={40}
                    height={40}
                    className="w-full h-full object-contain"
                    priority
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-sm sm:text-base lg:text-[17px] text-[#142544] leading-tight tracking-tight group-hover:text-[#C58A19] transition-colors">
                  Triumphant Harmony Brass
                </span>
                <span className="text-[#C58A19] text-[9px] sm:text-[10px] font-bold tracking-[0.22em] uppercase font-sans">
                  Music Academy
                </span>
              </div>
            </Link>

            {/* 2. Desktop Navigation Center */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 shrink-0">
              <Link
                href="/"
                className={cn(
                  'px-2.5 xl:px-3.5 py-1.5 rounded-full text-xs xl:text-sm font-medium whitespace-nowrap shrink-0 transition-all duration-200',
                  pathname === '/'
                    ? 'bg-[#F8EBCB] text-[#9A680C] font-semibold shadow-xs'
                    : 'text-[#17243A] hover:text-[#C58A19] hover:bg-[#F8F7F4]'
                )}
              >
                Home
              </Link>

              <Link
                href="/about"
                className={cn(
                  'px-2.5 xl:px-3.5 py-1.5 rounded-full text-xs xl:text-sm font-medium whitespace-nowrap shrink-0 transition-all duration-200',
                  pathname === '/about'
                    ? 'bg-[#F8EBCB] text-[#9A680C] font-semibold shadow-xs'
                    : 'text-[#17243A] hover:text-[#C58A19] hover:bg-[#F8F7F4]'
                )}
              >
                About Us
              </Link>

              {/* Programs Dropdown */}
              <div className="relative shrink-0" ref={programsRef}>
                <button
                  type="button"
                  onClick={() => setIsProgramsOpen(!isProgramsOpen)}
                  onMouseEnter={() => setIsProgramsOpen(true)}
                  className={cn(
                    'px-2.5 xl:px-3.5 py-1.5 rounded-full text-xs xl:text-sm font-medium whitespace-nowrap shrink-0 transition-all duration-200 inline-flex items-center gap-1 cursor-pointer',
                    pathname?.startsWith('/programs')
                      ? 'bg-[#F8EBCB] text-[#9A680C] font-semibold shadow-xs'
                      : 'text-[#17243A] hover:text-[#C58A19] hover:bg-[#F8F7F4]'
                  )}
                  aria-expanded={isProgramsOpen}
                >
                  <span className="whitespace-nowrap">Programs</span>
                  <ChevronDown
                    className={cn(
                      'w-3.5 h-3.5 transition-transform duration-200 shrink-0',
                      isProgramsOpen ? 'rotate-180 text-[#C58A19]' : 'text-[#647084]'
                    )}
                  />
                </button>

                {isProgramsOpen && (
                  <div
                    onMouseLeave={() => setIsProgramsOpen(false)}
                    className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-[0_16px_36px_-6px_rgba(20,37,68,0.12)] border border-[#E7E5DF] p-3 z-50 animate-slide-down"
                  >
                    <div className="text-[10px] font-bold text-[#647084] uppercase tracking-wider px-3 py-1 mb-1">
                      Our Disciplines
                    </div>
                    <div className="space-y-1">
                      {programCategories.map((cat, idx) => {
                        const Icon = cat.icon;
                        return (
                          <Link
                            key={idx}
                            href={cat.href}
                            className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F8F7F4] transition-colors group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-[#F8EBCB]/60 text-[#C58A19] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#C58A19] group-hover:text-white transition-colors">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-[#142544] group-hover:text-[#C58A19] transition-colors">
                                {cat.title}
                              </div>
                              <div className="text-[11px] text-[#647084] leading-tight mt-0.5">
                                {cat.desc}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                    <div className="mt-2 pt-2 border-t border-[#E7E5DF] px-2 flex justify-between items-center text-xs">
                      <Link
                        href="/programs"
                        className="text-[#C58A19] hover:text-[#9A680C] font-semibold inline-flex items-center gap-1 group py-1"
                      >
                        <span>View All Academy Programs</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/stage-performances"
                className={cn(
                  'px-2.5 xl:px-3.5 py-1.5 rounded-full text-xs xl:text-sm font-medium whitespace-nowrap shrink-0 transition-all duration-200',
                  pathname === '/stage-performances'
                    ? 'bg-[#F8EBCB] text-[#9A680C] font-semibold shadow-xs'
                    : 'text-[#17243A] hover:text-[#C58A19] hover:bg-[#F8F7F4]'
                )}
              >
                Stage Performances
              </Link>

              <Link
                href="/events"
                className={cn(
                  'px-2.5 xl:px-3.5 py-1.5 rounded-full text-xs xl:text-sm font-medium whitespace-nowrap shrink-0 transition-all duration-200',
                  pathname === '/events'
                    ? 'bg-[#F8EBCB] text-[#9A680C] font-semibold shadow-xs'
                    : 'text-[#17243A] hover:text-[#C58A19] hover:bg-[#F8F7F4]'
                )}
              >
                Events
              </Link>

              <Link
                href="/contact"
                className={cn(
                  'px-2.5 xl:px-3.5 py-1.5 rounded-full text-xs xl:text-sm font-medium whitespace-nowrap shrink-0 transition-all duration-200',
                  pathname === '/contact'
                    ? 'bg-[#F8EBCB] text-[#9A680C] font-semibold shadow-xs'
                    : 'text-[#17243A] hover:text-[#C58A19] hover:bg-[#F8F7F4]'
                )}
              >
                Contact Us
              </Link>
            </nav>

            {/* 3. Right Actions: Search, Student Sign In, Get Started */}
            <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
              {/* Search Button */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="w-8 h-8 xl:w-9 xl:h-9 rounded-full bg-[#F8F7F4] hover:bg-[#F5F0E6] text-[#142544] hover:text-[#C58A19] border border-[#E7E5DF] flex items-center justify-center transition-colors cursor-pointer shrink-0"
                aria-label="Search academy programs and courses"
              >
                <Search className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
              </button>

              {/* Student Sign In */}
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-2 xl:px-3 py-2 text-xs xl:text-sm font-semibold text-[#142544] hover:text-[#C58A19] transition-colors whitespace-nowrap shrink-0"
              >
                <User className="w-4 h-4 text-[#647084]" />
                <span>Sign In</span>
              </Link>

              {/* Get Started Button (Approved Gold Pill CTA) */}
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 xl:gap-2 px-3.5 xl:px-5 py-2 xl:py-2.5 bg-[#C58A19] hover:bg-[#b07b14] active:bg-[#9a680c] !text-white font-semibold rounded-full text-xs xl:text-sm transition-all shadow-[0_2px_12px_rgba(197,138,25,0.28)] hover:shadow-[0_4px_18px_rgba(197,138,25,0.4)] whitespace-nowrap shrink-0 group"
              >
                <span className="!text-white font-semibold">Get Started</span>
                <ArrowRight className="w-3.5 h-3.5 xl:w-4 xl:h-4 !text-white group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* 4. Mobile Menu Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-full bg-[#F8F7F4] border border-[#E7E5DF] text-[#142544]"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl bg-[#F8F7F4] border border-[#E7E5DF] text-[#142544] hover:bg-[#F5F0E6] cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Modal / Popover Bar */}
        {isSearchOpen && (
          <div className="border-t border-[#E7E5DF] bg-[#F8F7F4] px-4 py-3 animate-slide-down">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="absolute left-3.5 w-4 h-4 text-[#647084]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search programs, instruments (Trumpet, Saxophone, Piano...), or events..."
                  className="w-full pl-10 pr-24 py-2.5 bg-white border border-[#E7E5DF] rounded-full text-sm text-[#17243A] placeholder:text-[#8896AB] focus:outline-none focus:ring-2 focus:ring-[#C58A19]/30 focus:border-[#C58A19]"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-1.5 px-4 py-1.5 bg-[#142544] hover:bg-[#243653] text-white text-xs font-semibold rounded-full transition-colors cursor-pointer"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E7E5DF] bg-white px-4 pt-4 pb-6 space-y-2 shadow-2xl max-h-[85vh] overflow-y-auto animate-slide-down">
            <Link
              href="/"
              className={cn(
                'block px-4 py-3 rounded-xl text-sm font-semibold transition-colors',
                pathname === '/' ? 'bg-[#F8EBCB] text-[#9A680C]' : 'text-[#17243A] hover:bg-[#F8F7F4]'
              )}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={cn(
                'block px-4 py-3 rounded-xl text-sm font-semibold transition-colors',
                pathname === '/about' ? 'bg-[#F8EBCB] text-[#9A680C]' : 'text-[#17243A] hover:bg-[#F8F7F4]'
              )}
            >
              About Us
            </Link>
            <Link
              href="/programs"
              className={cn(
                'block px-4 py-3 rounded-xl text-sm font-semibold transition-colors',
                pathname?.startsWith('/programs') ? 'bg-[#F8EBCB] text-[#9A680C]' : 'text-[#17243A] hover:bg-[#F8F7F4]'
              )}
            >
              Programs & Courses
            </Link>
            <Link
              href="/stage-performances"
              className={cn(
                'block px-4 py-3 rounded-xl text-sm font-semibold transition-colors',
                pathname === '/stage-performances' ? 'bg-[#F8EBCB] text-[#9A680C]' : 'text-[#17243A] hover:bg-[#F8F7F4]'
              )}
            >
              Stage Performances
            </Link>
            <Link
              href="/events"
              className={cn(
                'block px-4 py-3 rounded-xl text-sm font-semibold transition-colors',
                pathname === '/events' ? 'bg-[#F8EBCB] text-[#9A680C]' : 'text-[#17243A] hover:bg-[#F8F7F4]'
              )}
            >
              Events & Recitals
            </Link>
            <Link
              href="/contact"
              className={cn(
                'block px-4 py-3 rounded-xl text-sm font-semibold transition-colors',
                pathname === '/contact' ? 'bg-[#F8EBCB] text-[#9A680C]' : 'text-[#17243A] hover:bg-[#F8F7F4]'
              )}
            >
              Contact Us
            </Link>

            <div className="pt-4 border-t border-[#E7E5DF] space-y-2.5">
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-semibold text-[#142544] bg-[#F8F7F4] hover:bg-[#F5F0E6] rounded-xl border border-[#E7E5DF]"
              >
                <User className="w-4 h-4 text-[#647084]" />
                <span>Student Sign In</span>
              </Link>
              <Link
                href="/register"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-semibold text-white bg-[#C58A19] hover:bg-[#b07b14] rounded-xl shadow-md"
              >
                <span>Get Started — Enroll Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
