'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LevelBadge } from '@/components/ui/level-badge';
import { formatCoursePrice } from '@/lib/utils';
import { Share2, Copy, Check, MessageCircle, Clock, Calendar, Shield, Award } from 'lucide-react';
import type { CourseWithRelations } from '@/types/database.types';

interface ProgramDetailClientProps {
  initialCourse: CourseWithRelations;
  siblingCourses: CourseWithRelations[];
}

export function ProgramDetailClient({ initialCourse, siblingCourses }: ProgramDetailClientProps) {
  const [activeCourse, setActiveCourse] = useState<CourseWithRelations>(initialCourse);
  const [copied, setCopied] = useState(false);

  const coursesList = siblingCourses.length > 0 ? siblingCourses : [initialCourse];

  const instructorName = activeCourse.instructor
    ? `${activeCourse.instructor.first_name} ${activeCourse.instructor.last_name}`
    : null;

  const currentUrl = typeof window !== 'undefined'
    ? window.location.href
    : `https://thbacademy.org/programs/${activeCourse.slug}`;

  function handleCopyLink() {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const whatsappShareText = encodeURIComponent(
    `Check out ${activeCourse.name} at THB Music Academy!\n${currentUrl}`
  );

  return (
    <>
      {/* Header / Hero */}
      <section className="pt-32 pb-12 px-4 bg-navy-900 border-b border-navy-800/50 relative overflow-hidden">
        {activeCourse.image_url && (
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <img src={activeCourse.image_url} alt="" className="w-full h-full object-cover blur-sm" />
          </div>
        )}

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Breadcrumbs */}
          <nav className="text-sm text-navy-400 mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-brand-400 transition-colors">Home</Link>
            <span>›</span>
            <Link href="/programs" className="hover:text-brand-400 transition-colors">Programs</Link>
            <span>›</span>
            <span className="text-navy-200">{activeCourse.name}</span>
          </nav>

          {/* Badges & Share Header Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex flex-wrap items-center gap-3">
              {activeCourse.instrument && (
                <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-500/10 text-brand-400 border border-brand-500/30">
                  {activeCourse.instrument.name}
                </span>
              )}
              <LevelBadge level={activeCourse.level} />
            </div>

            {/* Share Buttons Header */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="px-3.5 py-1.5 bg-navy-950/80 border border-navy-700 hover:border-brand-500 text-navy-200 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                title="Copy Program Link"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
              </button>

              <a
                href={`https://api.whatsapp.com/send?text=${whatsappShareText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-600/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                title="Share on WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-4">
            {activeCourse.name}
          </h1>

          {activeCourse.description && (
            <p className="text-navy-300 text-lg max-w-3xl leading-relaxed">
              {activeCourse.description}
            </p>
          )}

          {/* Level Selector Tabs if multiple levels exist */}
          {coursesList.length > 1 && (
            <div className="mt-8 pt-6 border-t border-navy-800/80">
              <p className="text-xs font-bold text-brand-400 uppercase tracking-widest mb-3">
                Select Skill Level Option:
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {coursesList.map((c) => {
                  const isSelected = c.id === activeCourse.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setActiveCourse(c)}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border flex items-center gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-brand-500 text-white border-brand-400 shadow-glow'
                          : 'bg-navy-950/80 text-navy-300 border-navy-700 hover:border-brand-500/50 hover:text-white'
                      }`}
                    >
                      <span>{c.level.replace('_', ' ')}</span>
                      <span className="opacity-75 font-normal">({formatCoursePrice(c.price)})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Content & Sidebar */}
      <section className="py-12 px-4 bg-navy-950">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Program Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Banner Image Display */}
            {activeCourse.image_url && (
              <div className="rounded-2xl overflow-hidden border border-navy-800 h-64 sm:h-80 relative shadow-2xl">
                <img src={activeCourse.image_url} alt={activeCourse.name} className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4">
                  <LevelBadge level={activeCourse.level} />
                </div>
              </div>
            )}

            {/* Detailed Content */}
            {activeCourse.detailed_content && (
              <div>
                <h2 className="text-2xl font-heading font-bold text-white mb-4">
                  About This Program
                </h2>
                <div className="text-navy-300 leading-relaxed whitespace-pre-wrap">
                  {activeCourse.detailed_content}
                </div>
              </div>
            )}

            {/* What You'll Learn */}
            {activeCourse.what_you_learn && (
              <div>
                <h2 className="text-2xl font-heading font-bold text-white mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6 text-brand-400" />
                  What You&apos;ll Learn
                </h2>
                <div className="text-navy-300 leading-relaxed whitespace-pre-wrap bg-navy-900/60 border border-navy-800 rounded-2xl p-6">
                  {activeCourse.what_you_learn}
                </div>
              </div>
            )}

            {/* Who Can Join */}
            {activeCourse.who_can_join && (
              <div>
                <h2 className="text-2xl font-heading font-bold text-white mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-brand-400" />
                  Who Can Join
                </h2>
                <div className="text-navy-300 leading-relaxed whitespace-pre-wrap bg-navy-900/60 border border-navy-800 rounded-2xl p-6">
                  {activeCourse.who_can_join}
                </div>
              </div>
            )}

            {/* FAQs */}
            {activeCourse.faqs && activeCourse.faqs.length > 0 && (
              <div>
                <h2 className="text-2xl font-heading font-bold text-white mb-4">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-3">
                  {activeCourse.faqs.map((faq, index) => (
                    <details
                      key={index}
                      className="group bg-navy-900/80 border border-navy-800 rounded-xl overflow-hidden"
                    >
                      <summary className="px-6 py-4 cursor-pointer text-white font-medium hover:bg-navy-800 transition-colors list-none flex items-center justify-between">
                        {faq.question}
                        <svg
                          className="w-5 h-5 text-navy-400 transition-transform group-open:rotate-180"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="px-6 pb-4 text-navy-300 text-sm leading-relaxed border-t border-navy-800 pt-3">
                        {faq.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Enrollment Price Card */}
              <div className="bg-navy-900/90 border border-navy-800 rounded-2xl p-6 shadow-xl space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-navy-400 text-xs font-semibold uppercase tracking-wider">Tuition Fee</span>
                    <LevelBadge level={activeCourse.level} />
                  </div>

                  <p className="text-brand-400 font-bold text-3xl font-heading">
                    {formatCoursePrice(activeCourse.price, activeCourse.currency)}
                  </p>

                  <p className="text-navy-300 text-xs mt-1 font-medium flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-400" />
                    Program Duration: <strong className="text-white">{activeCourse.duration || '4 Weeks'}</strong>
                  </p>
                </div>

                <Link
                  href={`/register?program=${activeCourse.slug}&level=${activeCourse.level}`}
                  className="block w-full text-center px-6 py-3.5 bg-brand-500 text-navy-950 font-extrabold rounded-xl hover:bg-brand-400 transition-all duration-200 shadow-glow text-sm uppercase tracking-wider"
                >
                  ENROLL NOW — {activeCourse.level.toUpperCase()}
                </Link>

                {/* Share Link Box */}
                <div className="pt-4 border-t border-navy-800 space-y-2">
                  <p className="text-xs font-semibold text-navy-300">Share Program with Friends:</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyLink}
                      className="flex-1 py-2 px-3 bg-navy-950 border border-navy-700 hover:border-brand-500 text-navy-200 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Link Copied' : 'Copy Link'}</span>
                    </button>

                    <a
                      href={`https://api.whatsapp.com/send?text=${whatsappShareText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-600/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Program Summary Sidebar Box */}
              <div className="bg-navy-900/90 border border-navy-800 rounded-2xl p-6 space-y-4 shadow-xl">
                <h3 className="text-white font-bold text-sm uppercase tracking-wider border-b border-navy-800 pb-3">Program Details</h3>

                <div className="flex items-center justify-between py-1 text-xs">
                  <span className="text-navy-400">Selected Level</span>
                  <LevelBadge level={activeCourse.level} />
                </div>

                {activeCourse.instrument && (
                  <div className="flex items-center justify-between py-1.5 text-xs border-t border-navy-800/50">
                    <span className="text-navy-400">Instrument</span>
                    <span className="text-white font-medium">{activeCourse.instrument.name}</span>
                  </div>
                )}

                <div className="flex items-center justify-between py-1.5 text-xs border-t border-navy-800/50">
                  <span className="text-navy-400">Duration</span>
                  <span className="text-white font-semibold">{activeCourse.duration || '4 Weeks'}</span>
                </div>

                {activeCourse.schedule_info && (
                  <div className="flex items-center justify-between py-1.5 text-xs border-t border-navy-800/50">
                    <span className="text-navy-400">Schedule</span>
                    <span className="text-white font-medium">{activeCourse.schedule_info}</span>
                  </div>
                )}

                {instructorName && (
                  <div className="flex items-center justify-between py-1.5 text-xs border-t border-navy-800/50">
                    <span className="text-navy-400">Instructor</span>
                    <span className="text-white font-medium">{instructorName}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
