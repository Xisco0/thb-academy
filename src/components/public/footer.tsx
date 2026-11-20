import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { WebsiteSettings } from '@/types/database.types';
import { MapPin, Phone, Mail, Award, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  settings: WebsiteSettings | null;
}

export function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/programs', label: 'All Programs & Courses' },
    { href: '/stage-performances', label: 'Stage Performances' },
    { href: '/events', label: 'Events & Recitals' },
    { href: '/contact', label: 'Contact Us' },
  ];

  const programLinks = [
    { href: '/programs?category=brass', label: 'Trumpet & Brass Ensemble' },
    { href: '/programs?category=woodwinds', label: 'Saxophone & Woodwinds' },
    { href: '/programs?category=strings', label: 'Piano & Master Keyboards' },
    { href: '/programs?category=strings', label: 'Guitar & Violin Arts' },
    { href: '/programs?category=percussion', label: 'Drums & African Percussion' },
    { href: '/programs?category=voice', label: 'Vocal Performance & Choir' },
  ];

  const studentLinks = [
    { href: '/login', label: 'Student Sign In' },
    { href: '/register', label: 'Enroll / Student Registration' },
    { href: '/forgot-password', label: 'Password Recovery' },
    { href: '/student', label: 'Student Learning Portal' },
  ];

  return (
    <footer className="bg-[#F8F7F4] border-t border-[#E7E5DF] text-[#17243A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="py-14 lg:py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Column 1: Brand & Founder (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="flex items-center gap-3 group inline-flex">
              <div className="relative w-11 h-11 rounded-xl p-0.5 bg-gradient-to-br from-[#C58A19] to-[#9A680C] shadow-sm transition-transform group-hover:scale-105 flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-[#142544] rounded-[10px] p-1 flex items-center justify-center overflow-hidden">
                  <Image
                    src="/images/logo.png"
                    alt="Triumphant Harmony Brass Logo"
                    width={40}
                    height={40}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[#142544] font-heading font-bold text-base lg:text-lg leading-tight group-hover:text-[#C58A19] transition-colors">
                  Triumphant Harmony Brass
                </span>
                <span className="text-[#C58A19] text-[9px] font-bold tracking-[0.2em] uppercase font-sans">
                  Music Academy
                </span>
              </div>
            </Link>

            <p className="text-[#647084] text-sm leading-relaxed max-w-sm">
              {settings?.tagline ||
                'The sound of victory, The heart of harmony. Lagos premier music academy training disciplined instrumentalists and concert performers.'}
            </p>

            {/* Founder Spotlight Card */}
            <div className="p-4 bg-white border border-[#E7E5DF] rounded-2xl shadow-xs flex items-center gap-3.5">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[#C58A19]/30">
                <Image
                  src="/images/founder.jpg"
                  alt="Taiwo Toyinbo"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#C58A19] uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5" />
                  <span>Founder & Music Director</span>
                </div>
                <div className="text-sm font-bold text-[#142544] truncate">Taiwo Toyinbo</div>
                <div className="text-[11px] text-[#647084] truncate">Leading Excellence in Music Education</div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-1">
              {settings?.facebook_url && (
                <SocialLink href={settings.facebook_url} label="Facebook">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </SocialLink>
              )}
              {settings?.instagram_url && (
                <SocialLink href={settings.instagram_url} label="Instagram">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </SocialLink>
              )}
              {settings?.youtube_url && (
                <SocialLink href={settings.youtube_url} label="YouTube">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </SocialLink>
              )}
            </div>
          </div>

          {/* Column 2: Navigation Links (2.5 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-heading font-bold text-sm text-[#142544] uppercase tracking-wider border-l-2 border-[#C58A19] pl-3">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#647084] hover:text-[#C58A19] transition-colors inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Programs (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-heading font-bold text-sm text-[#142544] uppercase tracking-wider border-l-2 border-[#C58A19] pl-3">
              Academic Tracks
            </h3>
            <ul className="space-y-2.5 text-sm">
              {programLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="text-[#647084] hover:text-[#C58A19] transition-colors inline-flex items-center gap-1 group"
                  >
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Admissions & Contact (2.5 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-heading font-bold text-sm text-[#142544] uppercase tracking-wider border-l-2 border-[#C58A19] pl-3">
              Contact & Portal
            </h3>
            <div className="space-y-3 text-sm text-[#647084]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C58A19] shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed">
                  {settings?.address || 'Lagos, Nigeria'}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C58A19] shrink-0" />
                <a
                  href={`tel:${settings?.phone || settings?.contact_phone || '+2347038595356'}`}
                  className="text-xs hover:text-[#C58A19] transition-colors"
                >
                  {settings?.phone || settings?.contact_phone || '+234 703 859 5356'}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C58A19] shrink-0" />
                <a
                  href={`mailto:${settings?.email || settings?.contact_email || 'info@thbacademy.org'}`}
                  className="text-xs hover:text-[#C58A19] transition-colors"
                >
                  {settings?.email || settings?.contact_email || 'info@thbacademy.org'}
                </a>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#142544] hover:bg-[#243653] !text-white text-xs font-semibold rounded-full shadow-xs transition-colors"
              >
                <span className="!text-white font-semibold">Enroll Online</span>
                <ArrowUpRight className="w-3.5 h-3.5 !text-white" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Legal Bar */}
        <div className="py-6 border-t border-[#E7E5DF] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#647084]">
          <div>
            &copy; {currentYear} Triumphant Harmony Brass Music Academy. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-[#C58A19] transition-colors">
              About Academy
            </Link>
            <Link href="/programs" className="hover:text-[#C58A19] transition-colors">
              Curriculum
            </Link>
            <Link href="/contact" className="hover:text-[#C58A19] transition-colors">
              Admissions
            </Link>
            <Link href="/login" className="hover:text-[#C58A19] transition-colors">
              Student Sign In
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-8 h-8 rounded-full bg-white border border-[#E7E5DF] text-[#647084] hover:text-[#C58A19] hover:border-[#C58A19] flex items-center justify-center transition-all shadow-xs hover:scale-105"
    >
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
        {children}
      </svg>
    </a>
  );
}
