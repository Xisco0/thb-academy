'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LevelBadge } from '@/components/ui/level-badge';
import { Share2, Copy, Check, MessageCircle, Shield, Award, Clock, ArrowRight, User } from 'lucide-react';
import type { CourseWithRelations } from '@/types/database.types';

interface ProgramDetailClientProps {
  initialCourse: CourseWithRelations;
  siblingCourses: CourseWithRelations[];
}

export function ProgramDetailClient({ initialCourse, siblingCourses }: ProgramDetailClientProps) {
  const [activeCourse, setActiveCourse] = useState<CourseWithRelations>(initialCourse);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>(
    `https://thbacademy.org/programs/${initialCourse.slug}`
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.href);
    }
  }, [activeCourse.slug]);

  const coursesList = siblingCourses.length > 0 ? siblingCourses : [initialCourse];

  const instructorName = activeCourse.instructor
    ? `${activeCourse.instructor.first_name} ${activeCourse.instructor.last_name}`
    : null;

  function handleCopyLink() {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const levelFormatted = (activeCourse.level || 'beginner')
    .replace('_', ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());

  const whatsappEnquiryMessage = encodeURIComponent(
    `Hello THB Academy,\n\nI would like to enquire about registering for the following programme:\n\nProgramme: ${activeCourse.name}\nLevel: ${levelFormatted}\n\nPlease provide me with more information about the programme, schedule and registration process.\n\nThank you.`
  );

  const whatsappShareText = encodeURIComponent(
    `Check out ${activeCourse.name} at THB Music Academy!\n${shareUrl}`
  );

  return (
    <div className="bg-white min-h-screen">
      {/* 1. Header / Hero Section */}
      <section className="pt-28 pb-12 px-4 bg-gradient-to-b from-[#F8F7F4] to-white border-b border-[#E7E5DF] relative">
        <div className="max-w-6xl mx-auto relative z-10 space-y-6">
          {/* Breadcrumbs */}
          <nav className="text-xs sm:text-sm text-[#647084] flex items-center gap-2">
            <Link href="/" className="hover:text-[#C58A19] transition-colors">Home</Link>
            <span>&rsaquo;</span>
            <Link href="/programs" className="hover:text-[#C58A19] transition-colors">Programs</Link>
            <span>&rsaquo;</span>
            <span className="text-[#142544] font-medium truncate max-w-xs">{activeCourse.name}</span>
          </nav>

          {/* Badges & Share Header Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {activeCourse.instrument && (
                <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F8EBCB] text-[#9A680C]">
                  {activeCourse.instrument.name}
                </span>
              )}
              <LevelBadge level={activeCourse.level} />
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3.5 py-1.5 bg-white border border-[#E7E5DF] hover:border-[#C58A19] text-[#142544] hover:text-[#C58A19] rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="Copy Program Link"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#23845B]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
              </button>

              <a
                href={`https://api.whatsapp.com/send?text=${whatsappShareText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/20 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5"
                title="Share on WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-[#142544] tracking-tight">
            {activeCourse.name}
          </h1>

          {activeCourse.description && (
            <p className="text-[#647084] text-base sm:text-lg max-w-3xl leading-relaxed">
              {activeCourse.description}
            </p>
          )}

          {/* Level Selector Tabs if sibling levels exist */}
          {coursesList.length > 1 && (
            <div className="pt-4 border-t border-[#E7E5DF]">
              <p className="text-xs font-bold text-[#C58A19] uppercase tracking-widest mb-3">
                Available Skill Level Tracks:
              </p>
              <div className="flex flex-wrap items-center gap-2.5">
                {coursesList.map((c) => {
                  const isSelected = c.id === activeCourse.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setActiveCourse(c)}
                      className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-[#142544] text-white border-[#142544] shadow-sm'
                          : 'bg-white text-[#647084] border-[#E7E5DF] hover:border-[#CBD5E1] hover:text-[#142544]'
                      }`}
                    >
                      <span>{c.level.replace('_', ' ')}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2. Main Content & Sidebar */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Banner Image */}
            {activeCourse.image_url && (
              <div className="rounded-2xl overflow-hidden border border-[#E7E5DF] h-64 sm:h-96 relative shadow-sm bg-[#F8F7F4]">
                <img
                  src={activeCourse.image_url}
                  alt={activeCourse.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <LevelBadge level={activeCourse.level} />
                </div>
              </div>
            )}

            {/* Detailed Content */}
            {activeCourse.detailed_content && (
              <div className="bg-[#F8F7F4] border border-[#E7E5DF] rounded-2xl p-7 space-y-4">
                <h2 className="text-2xl font-heading font-bold text-[#142544]">
                  About This Course
                </h2>
                <div className="text-[#647084] leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                  {activeCourse.detailed_content}
                </div>
              </div>
            )}

            {/* What You'll Learn */}
            {activeCourse.what_you_learn && (
              <div className="bg-white border border-[#E7E5DF] rounded-2xl p-7 space-y-4 shadow-xs">
                <h2 className="text-2xl font-heading font-bold text-[#142544] flex items-center gap-2.5">
                  <Award className="w-6 h-6 text-[#C58A19]" />
                  What You&apos;ll Master
                </h2>
                <div className="text-[#647084] leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                  {activeCourse.what_you_learn}
                </div>
              </div>
            )}

            {/* Who Can Join */}
            {activeCourse.who_can_join && (
              <div className="bg-[#F8F7F4] border border-[#E7E5DF] rounded-2xl p-7 space-y-4">
                <h2 className="text-2xl font-heading font-bold text-[#142544] flex items-center gap-2.5">
                  <Shield className="w-6 h-6 text-[#C58A19]" />
                  Audience &amp; Prerequisites
                </h2>
                <div className="text-[#647084] leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                  {activeCourse.who_can_join}
                </div>
              </div>
            )}

            {/* FAQs */}
            {activeCourse.faqs && activeCourse.faqs.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-heading font-bold text-[#142544]">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-3">
                  {activeCourse.faqs.map((faq, index) => (
                    <details
                      key={index}
                      className="group bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl overflow-hidden"
                    >
                      <summary className="px-6 py-4 cursor-pointer text-[#142544] font-semibold hover:bg-[#F5F0E6] transition-colors list-none flex items-center justify-between">
                        <span>{faq.question}</span>
                        <span className="text-[#647084] group-open:rotate-180 transition-transform">&darr;</span>
                      </summary>
                      <div className="px-6 pb-4 text-[#647084] text-sm leading-relaxed border-t border-[#E7E5DF] pt-3 bg-white">
                        {faq.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar (4 cols) */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              {/* Enrollment / Enquiry Card */}
              <div className="bg-white border border-[#E7E5DF] rounded-2xl p-6 sm:p-7 shadow-[0_8px_24px_-4px_rgba(20,37,68,0.06)] space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#647084] text-xs font-semibold uppercase tracking-wider">
                      Admissions Open
                    </span>
                    <LevelBadge level={activeCourse.level} />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-[#142544]">
                    {activeCourse.name}
                  </h3>
                </div>

                {/* Primary CTA */}
                <div className="space-y-3">
                  <Link
                    href={`/register?course=${activeCourse.id}`}
                    className="w-full text-center px-6 py-3.5 bg-[#C58A19] hover:bg-[#b07b14] active:bg-[#9a680c] text-white font-bold rounded-full transition-all shadow-[0_2px_12px_rgba(197,138,25,0.25)] text-sm uppercase tracking-wider flex items-center justify-center gap-2 group"
                  >
                    <span>Enroll in This Program</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>

                  <a
                    href={`https://api.whatsapp.com/send?phone=2347038595356&text=${whatsappEnquiryMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center px-6 py-3 bg-[#F8F7F4] hover:bg-[#F5F0E6] text-[#142544] border border-[#E7E5DF] font-semibold rounded-full transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    <span>Inquire via WhatsApp</span>
                  </a>
                </div>

                {/* Program Summary Details */}
                <div className="pt-5 border-t border-[#E7E5DF] space-y-3 text-xs text-[#647084]">
                  <div className="flex items-center justify-between py-1">
                    <span>Skill Track</span>
                    <span className="font-semibold text-[#142544]">{levelFormatted}</span>
                  </div>

                  {activeCourse.instrument && (
                    <div className="flex items-center justify-between py-1 border-t border-[#E7E5DF]/60">
                      <span>Instrument Family</span>
                      <span className="font-semibold text-[#142544]">{activeCourse.instrument.name}</span>
                    </div>
                  )}

                  {instructorName && (
                    <div className="flex items-center justify-between py-1 border-t border-[#E7E5DF]/60">
                      <span>Lead Instructor</span>
                      <span className="font-semibold text-[#142544]">{instructorName}</span>
                    </div>
                  )}

                  {activeCourse.duration && (
                    <div className="flex items-center justify-between py-1 border-t border-[#E7E5DF]/60">
                      <span>Term Duration</span>
                      <span className="font-semibold text-[#142544]">{activeCourse.duration}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Consultation Assistance Box */}
              <div className="bg-[#F8F7F4] border border-[#E7E5DF] rounded-2xl p-6 text-center space-y-3">
                <h4 className="font-heading font-bold text-base text-[#142544]">Need Help Choosing?</h4>
                <p className="text-xs text-[#647084] leading-relaxed">
                  Our music director and instructors are happy to assess your playing level and recommend the best program track.
                </p>
                <Link
                  href="/contact"
                  className="inline-block text-xs font-semibold text-[#C58A19] hover:underline"
                >
                  Schedule a Level Assessment &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
