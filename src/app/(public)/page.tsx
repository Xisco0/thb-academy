import { getFeaturedCourses, getPublishedCourses, getUpcomingEvents, getWebsiteSettings } from '@/lib/queries/public';
import { formatCoursePrice } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import {
  Music,
  ArrowRight,
  Calendar,
  MapPin,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Users,
  Award,
  ChevronRight,
  Play,
  Trophy,
  Star,
  GraduationCap,
  Volume2,
} from 'lucide-react';
import { LevelBadge } from '@/components/ui/level-badge';
import { organizationSchema, JsonLd } from '@/lib/seo';

const siteUrl = 'https://www.thbacademy.org';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Triumphant Harmony Brass | Premier Music Academy in Lagos, Nigeria',
  description:
    'Discover, learn, and perform music at Triumphant Harmony Brass (THB) Music Academy in Lagos, Nigeria. Professional training in trumpet, saxophone, keyboard, guitar, violin, drums, and voice.',
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'Triumphant Harmony Brass | Premier Music Academy in Lagos, Nigeria',
    description:
      'Premier music education institution in Lagos, Nigeria. Classical rigor, modern technique, and practical stage performance training under Taiwo Toyinbo & faculty.',
    url: siteUrl,
    siteName: 'Triumphant Harmony Brass Music Academy',
    locale: 'en_NG',
    type: 'website',
    images: [
      {
        url: `${siteUrl}/images/image.png`,
        width: 1200,
        height: 630,
        alt: 'Triumphant Harmony Brass Music Academy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Triumphant Harmony Brass | Premier Music Academy in Lagos, Nigeria',
    description:
      'Premier music education institution in Lagos, Nigeria. Professional training in keyboard, guitar, trumpet, saxophone, violin, drums, and voice.',
    images: [`${siteUrl}/images/image.png`],
  },
};

export default async function HomePage() {
  const settings = await getWebsiteSettings();
  let featuredCourses = await getFeaturedCourses();
  if (!featuredCourses || featuredCourses.length === 0) {
    featuredCourses = await getPublishedCourses();
  }
  const upcomingEvents = await getUpcomingEvents(3);

  const instruments = [
    'Trumpet',
    'Saxophone',
    'Keyboard & Piano',
    'Acoustic Guitar',
    'Violin',
    'Drums & Percussion',
    'Trombone',
    'Vocal Arts',
    'French Horn',
  ];
  const duplicatedInstruments = [...instruments, ...instruments, ...instruments];

  return (
    <main className="min-h-screen bg-white text-[#17243A] overflow-x-hidden pt-20 lg:pt-24">
      <JsonLd data={organizationSchema(settings)} />

      {/* ========================================================
          1. APPROVED EDITORIAL HERO SECTION
          Recreated faithfully from the approved reference design
          ======================================================== */}
      <section className="relative bg-gradient-to-b from-[#F8F7F4]/80 via-white to-white overflow-hidden pb-12 lg:pb-16 pt-6 lg:pt-10">
        {/* Subtle decorative gold/ambient glow */}
        <div
          aria-hidden="true"
          className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#F8EBCB]/40 rounded-full blur-[140px] pointer-events-none -z-10"
        />
        <div
          aria-hidden="true"
          className="absolute top-1/3 left-[-100px] w-[400px] h-[400px] bg-[#F5F0E6] rounded-full blur-[100px] pointer-events-none -z-10"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-6 lg:space-y-8 text-left">
              {/* Eyebrow with gold rule */}
              <div className="inline-flex items-center gap-3">
                <span className="text-[11px] sm:text-xs font-bold tracking-[0.22em] text-[#647084] uppercase">
                  MUSIC &bull; TRAINING &bull; PERFORMANCE
                </span>
                <span className="h-[2px] w-12 bg-[#C58A19] inline-block rounded-full" />
              </div>

              {/* Headline */}
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#142544] tracking-tight leading-[1.12]">
                Discover, Learn &amp; <br />
                Perform Music with <br />
                <span className="text-[#C58A19] font-normal italic drop-shadow-xs">
                  Triumphant Harmony Brass
                </span>
              </h1>

              {/* Tagline / Subhead */}
              <p className="text-base sm:text-lg text-[#647084] leading-relaxed max-w-xl">
                {settings?.tagline ? (
                  <span>{settings.tagline}</span>
                ) : (
                  <span>
                    A premier music academy in Lagos, Nigeria, empowering musicians through
                    classical rigor, modern technique, and real stage performance training under
                    Music Director Taiwo Toyinbo &amp; faculty.
                  </span>
                )}
              </p>

              {/* Hero Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/programs"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#142544] hover:bg-[#243653] active:bg-[#0e1b32] !text-white font-semibold rounded-full text-sm sm:text-base transition-all shadow-[0_4px_16px_rgba(20,37,68,0.18)] hover:shadow-[0_6px_22px_rgba(20,37,68,0.26)] transform hover:-translate-y-0.5"
                >
                  <span className="!text-white font-semibold">Explore Our Programs</span>
                  <ArrowRight className="w-4 h-4 !text-white" />
                </Link>

                <a
                  href={settings?.youtube_url || '#programs'}
                  target={settings?.youtube_url ? '_blank' : undefined}
                  rel={settings?.youtube_url ? 'noopener noreferrer' : undefined}
                  className="group inline-flex items-center gap-3 px-6 py-3.5 bg-white hover:bg-[#F8F7F4] text-[#142544] hover:text-[#C58A19] border border-[#E7E5DF] hover:border-[#C58A19]/40 font-semibold rounded-full text-sm sm:text-base transition-all shadow-xs"
                >
                  <span className="relative flex items-center justify-center w-8 h-8 shrink-0">
                    {/* Ripple ring 1 */}
                    <span className="absolute inset-0 rounded-full bg-[#C58A19]/35 animate-ripple pointer-events-none" />
                    {/* Ripple ring 2 (delayed wave) */}
                    <span className="absolute inset-0 rounded-full bg-[#C58A19]/25 animate-ripple-delayed pointer-events-none" />
                    {/* Solid core play button */}
                    <span className="relative w-8 h-8 rounded-full bg-[#F8EBCB] text-[#C58A19] group-hover:bg-[#C58A19] group-hover:text-white flex items-center justify-center shadow-xs transition-colors duration-300">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5 transition-transform duration-300 group-hover:scale-110" />
                    </span>
                  </span>
                  <span>Watch Academy Video</span>
                </a>
              </div>
            </div>

            {/* Right Showcase Column (Approved Imagery with golden wave background) */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden p-2 bg-gradient-to-tr from-[#F8EBCB]/80 via-white to-[#F5F0E6] shadow-[0_20px_50px_-15px_rgba(20,37,68,0.12)] border border-[#E7E5DF]">
                <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden bg-[#142544]">
                  <Image
                    src="/images/hero-musicians.jpg"
                    alt="Musicians of Triumphant Harmony Brass playing trumpet, saxophone, and trombone"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#142544]/20 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>

          </div>

          {/* ========================================================
              HORIZONTALLY BRIDGING STATS CARD
              Floating with soft shadow and verified figures
              ======================================================== */}
          <div className="mt-12 lg:mt-16 bg-white border border-[#E7E5DF] rounded-2xl sm:rounded-full p-4 sm:p-6 shadow-[0_12px_32px_-8px_rgba(20,37,68,0.08)] max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E7E5DF]">
              
              {/* Stat 1 */}
              <div className="flex items-center justify-center gap-3.5 px-4 pt-2 sm:pt-0">
                <div className="w-12 h-12 rounded-full bg-[#F8EBCB] text-[#C58A19] flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-heading font-extrabold text-2xl sm:text-3xl text-[#142544] leading-tight">
                    500+
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-[#647084]">
                    Students Trained
                  </div>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex items-center justify-center gap-3.5 px-4 pt-4 sm:pt-0">
                <div className="w-12 h-12 rounded-full bg-[#F8EBCB] text-[#C58A19] flex items-center justify-center shrink-0">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-heading font-extrabold text-2xl sm:text-3xl text-[#142544] leading-tight">
                    10+
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-[#647084]">
                    Years of Excellence
                  </div>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="flex items-center justify-center gap-3.5 px-4 pt-4 sm:pt-0">
                <div className="w-12 h-12 rounded-full bg-[#F8EBCB] text-[#C58A19] flex items-center justify-center shrink-0">
                  <Music className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-heading font-extrabold text-2xl sm:text-3xl text-[#142544] leading-tight">
                    50+
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-[#647084]">
                    Stage Performances
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          2. APPROVED 4 PROGRAM CARDS SECTION
          Exact photographic cards matching the approved visual layout
          ======================================================== */}
      <section className="py-14 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div className="flex items-center gap-3">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#142544]">
                Our Programs
              </h2>
              <span className="h-[2px] w-12 bg-[#C58A19] inline-block rounded-full" />
            </div>
            <Link
              href="/programs"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C58A19] hover:text-[#9A680C] transition-colors group"
            >
              <span>View All Programs</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Brass & Woodwinds */}
            <Link
              href="/programs?category=brass"
              className="group bg-white rounded-2xl border border-[#E7E5DF] overflow-hidden shadow-[0_4px_16px_-4px_rgba(20,37,68,0.06)] hover:shadow-[0_16px_32px_-6px_rgba(20,37,68,0.12)] hover:border-[#C58A19]/50 hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#142544]">
                <Image
                  src="/images/programs-brass-v2.jpg"
                  alt="Brass & Woodwinds instruments"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#F8EBCB] text-[#C58A19] flex items-center justify-center">
                    <Music className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-[#142544] group-hover:text-[#C58A19] transition-colors">
                    Brass &amp; Woodwinds
                  </h3>
                  <p className="text-xs text-[#647084] leading-relaxed">
                    Trumpet, Saxophone, Trombone, French Horn &amp; Ensemble training.
                  </p>
                </div>
                <div className="pt-2 flex justify-end">
                  <span className="w-8 h-8 rounded-full bg-[#F8F7F4] group-hover:bg-[#C58A19] group-hover:text-white text-[#142544] flex items-center justify-center transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>

            {/* Card 2: Keyboards & Strings */}
            <Link
              href="/programs?category=strings"
              className="group bg-white rounded-2xl border border-[#E7E5DF] overflow-hidden shadow-[0_4px_16px_-4px_rgba(20,37,68,0.06)] hover:shadow-[0_16px_32px_-6px_rgba(20,37,68,0.12)] hover:border-[#C58A19]/50 hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#142544]">
                <Image
                  src="/images/programs-keyboards-v2.jpg"
                  alt="Piano and Keyboards training"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#F8EBCB] text-[#C58A19] flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-[#142544] group-hover:text-[#C58A19] transition-colors">
                    Keyboards &amp; Strings
                  </h3>
                  <p className="text-xs text-[#647084] leading-relaxed">
                    Piano, Acoustic/Electric Guitar, Violin, Drums &amp; Vocal Arts.
                  </p>
                </div>
                <div className="pt-2 flex justify-end">
                  <span className="w-8 h-8 rounded-full bg-[#F8F7F4] group-hover:bg-[#C58A19] group-hover:text-white text-[#142544] flex items-center justify-center transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>

            {/* Card 3: Live Performances */}
            <Link
              href="/stage-performances"
              className="group bg-white rounded-2xl border border-[#E7E5DF] overflow-hidden shadow-[0_4px_16px_-4px_rgba(20,37,68,0.06)] hover:shadow-[0_16px_32px_-6px_rgba(20,37,68,0.12)] hover:border-[#C58A19]/50 hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#142544]">
                <Image
                  src="/images/programs-live-v2.jpg"
                  alt="Live stage performances and concerts"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#F8EBCB] text-[#C58A19] flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-[#142544] group-hover:text-[#C58A19] transition-colors">
                    Live Performances
                  </h3>
                  <p className="text-xs text-[#647084] leading-relaxed">
                    Stage experience with recitals, concerts &amp; live event bands.
                  </p>
                </div>
                <div className="pt-2 flex justify-end">
                  <span className="w-8 h-8 rounded-full bg-[#F8F7F4] group-hover:bg-[#C58A19] group-hover:text-white text-[#142544] flex items-center justify-center transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>

            {/* Card 4: Mastery Certificate */}
            <Link
              href="/programs"
              className="group bg-white rounded-2xl border border-[#E7E5DF] overflow-hidden shadow-[0_4px_16px_-4px_rgba(20,37,68,0.06)] hover:shadow-[0_16px_32px_-6px_rgba(20,37,68,0.12)] hover:border-[#C58A19]/50 hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#142544]">
                <Image
                  src="/images/programs-certificate-v2.jpg"
                  alt="Academy certificate of mastery"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#F8EBCB] text-[#C58A19] flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-[#142544] group-hover:text-[#C58A19] transition-colors">
                    Mastery Certificate
                  </h3>
                  <p className="text-xs text-[#647084] leading-relaxed">
                    Structured curriculum for beginner, intermediate &amp; advanced.
                  </p>
                </div>
                <div className="pt-2 flex justify-end">
                  <span className="w-8 h-8 rounded-full bg-[#F8F7F4] group-hover:bg-[#C58A19] group-hover:text-white text-[#142544] flex items-center justify-center transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* ========================================================
          3. MARQUEE INSTRUMENT STRIP
          Clean light luxury pill strip
          ======================================================== */}
      <section className="py-6 border-y border-[#E7E5DF] bg-[#F8F7F4] overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#F8F7F4] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#F8F7F4] to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee flex gap-4 py-1">
          {duplicatedInstruments.map((inst, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 shrink-0 px-5 py-2 rounded-full bg-white border border-[#E7E5DF] text-[#142544] text-xs sm:text-sm font-semibold shadow-xs hover:border-[#C58A19] transition-colors"
            >
              <Music className="w-3.5 h-3.5 text-[#C58A19]" />
              <span>{inst}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          4. THE THB ACADEMY EXPERIENCE & 4 CORE PILLARS
          ======================================================== */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F8EBCB] text-[#9A680C] text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-[#C58A19]" />
              The THB Academy Experience
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#142544]">
              Empowering Musicians Through Practical Mastery
            </h2>
            <p className="text-base sm:text-lg text-[#647084] leading-relaxed">
              We combine classical rigor, modern technique, and stage performance discipline to train
              well-rounded instrumentalists and vocalists.
            </p>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#F8F7F4] border border-[#E7E5DF] p-7 rounded-2xl space-y-4 hover:border-[#C58A19] hover:bg-white hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#E7E5DF] text-[#C58A19] flex items-center justify-center group-hover:bg-[#142544] group-hover:text-white transition-colors shadow-xs">
                <Music className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-[#142544]">
                Brass &amp; Winds Mastery
              </h3>
              <p className="text-xs sm:text-sm text-[#647084] leading-relaxed">
                Specialized embouchure techniques, breath support, and section control for trumpet, trombone, and saxophone.
              </p>
            </div>

            <div className="bg-[#F8F7F4] border border-[#E7E5DF] p-7 rounded-2xl space-y-4 hover:border-[#C58A19] hover:bg-white hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#E7E5DF] text-[#C58A19] flex items-center justify-center group-hover:bg-[#142544] group-hover:text-white transition-colors shadow-xs">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-[#142544]">
                Harmonic Sight-Reading
              </h3>
              <p className="text-xs sm:text-sm text-[#647084] leading-relaxed">
                Comprehensive piano, keyboard, and guitar chord theory, scale application, and sight-reading fluency.
              </p>
            </div>

            <div className="bg-[#F8F7F4] border border-[#E7E5DF] p-7 rounded-2xl space-y-4 hover:border-[#C58A19] hover:bg-white hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#E7E5DF] text-[#C58A19] flex items-center justify-center group-hover:bg-[#142544] group-hover:text-white transition-colors shadow-xs">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-[#142544]">
                Rhythmic Precision
              </h3>
              <p className="text-xs sm:text-sm text-[#647084] leading-relaxed">
                Practical timing, drum set coordination, and traditional African talking drum grooves for tight rhythm sections.
              </p>
            </div>

            <div className="bg-[#F8F7F4] border border-[#E7E5DF] p-7 rounded-2xl space-y-4 hover:border-[#C58A19] hover:bg-white hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#E7E5DF] text-[#C58A19] flex items-center justify-center group-hover:bg-[#142544] group-hover:text-white transition-colors shadow-xs">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-[#142544]">
                Vocal Excellence
              </h3>
              <p className="text-xs sm:text-sm text-[#647084] leading-relaxed">
                Voice placement, pitch stamina, breathing control, and choir/solo performance arrangements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. FEATURED ACADEMY COURSES
          Dynamic data from queries with luxury card treatment
          ======================================================== */}
      <section id="programs" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C58A19]">
                Structured Music Education
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#142544]">
                Featured Training Programs
              </h2>
              <p className="text-[#647084] text-sm sm:text-base max-w-xl">
                Comprehensive practical courses designed for beginner, intermediate, and advanced musicians.
              </p>
            </div>
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#142544] hover:text-[#C58A19] transition-colors"
            >
              <span>Explore All Courses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses?.slice(0, 6).map((course: any) => (
              <div
                key={course.id}
                className="bg-white border border-[#E7E5DF] rounded-2xl overflow-hidden hover:border-[#C58A19]/50 hover:shadow-[0_16px_36px_-6px_rgba(20,37,68,0.1)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
              >
                {/* Course Image */}
                <div className="h-48 bg-[#F8F7F4] relative overflow-hidden border-b border-[#E7E5DF]">
                  {course.image_url ? (
                    <img
                      src={course.image_url}
                      alt={course.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={
                        course.name?.toLowerCase().includes('keyboard') || course.name?.toLowerCase().includes('piano')
                          ? '/images/programs-keyboards-v2.jpg'
                          : course.name?.toLowerCase().includes('guitar') || course.name?.toLowerCase().includes('string')
                          ? '/images/programs-live-v2.jpg'
                          : '/images/programs-brass-v2.jpg'
                      }
                      alt={course.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-3.5 right-3.5 z-10">
                    <LevelBadge level={course.level} />
                  </div>
                </div>

                {/* Course Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {course.instrument?.name && (
                      <span className="text-[11px] font-bold text-[#C58A19] uppercase tracking-wider block mb-1">
                        {course.instrument.name}
                      </span>
                    )}
                    <h3 className="font-heading text-xl font-bold text-[#142544] mb-2">
                      {course.name}
                    </h3>
                    <p className="text-[#647084] text-xs sm:text-sm line-clamp-2 leading-relaxed">
                      {course.description ||
                        'Comprehensive practical course designed to build musical excellence and stage confidence.'}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#E7E5DF] flex items-center justify-between">
                    <div>
                      {course.price ? (
                        <span className="font-heading font-bold text-base text-[#142544]">
                          {formatCoursePrice(course.price, course.currency)}
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-[#23845B]">Enrolling Now</span>
                      )}
                    </div>
                    <Link
                      href={`/programs/${course.slug}`}
                      className="px-4 py-2 bg-[#F8F7F4] hover:bg-[#142544] text-[#142544] hover:text-white border border-[#E7E5DF] rounded-full text-xs font-semibold transition-all"
                    >
                      View Syllabus
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#F8F7F4] hover:bg-[#F5F0E6] border border-[#E7E5DF] text-[#142544] font-semibold rounded-full text-sm transition-all shadow-xs"
            >
              <span>Browse Full Course Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          7. UPCOMING EVENTS & LIVE RECITALS
          Dynamic data from queries
          ======================================================== */}
      {upcomingEvents && upcomingEvents.length > 0 && (
        <section className="py-20 lg:py-24 bg-[#F8F7F4] border-t border-[#E7E5DF]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-[#C58A19]">
                  Live Concerts &amp; Workshops
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#142544]">
                  Upcoming Academy Events
                </h2>
                <p className="text-[#647084] text-sm sm:text-base max-w-xl">
                  Join our seasonal student recitals, brass masterclasses, and orchestral showcases across Lagos.
                </p>
              </div>
              <Link
                href="/events"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#142544] hover:text-[#C58A19] transition-colors"
              >
                <span>View Event Calendar</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingEvents.map((ev: any) => {
                const bannerSrc = ev.banner_url || '/images/thb-academy-banner.png';
                return (
                  <Link
                    key={ev.id}
                    href={`/events/${ev.slug}`}
                    className="group bg-white border border-[#E7E5DF] rounded-2xl overflow-hidden hover:border-[#C58A19]/50 hover:shadow-[0_16px_32px_-6px_rgba(20,37,68,0.1)] hover:-translate-y-1 transition-all duration-300 flex flex-col"
                  >
                    <div className="h-44 bg-[#142544] relative overflow-hidden">
                      <img
                        src={bannerSrc}
                        alt={ev.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 text-xs font-bold text-[#C58A19]">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(ev.date).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <h3 className="font-heading text-lg font-bold text-[#142544] group-hover:text-[#C58A19] transition-colors">
                          {ev.title}
                        </h3>
                        <p className="text-xs text-[#647084] line-clamp-2 leading-relaxed">
                          {ev.description}
                        </p>
                      </div>

                      {ev.venue_name && (
                        <div className="flex items-center gap-2 text-xs text-[#647084] pt-3 border-t border-[#E7E5DF]">
                          <MapPin className="w-3.5 h-3.5 text-[#C58A19] shrink-0" />
                          <span className="truncate">{ev.venue_name}</span>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          8. WHY LEARN AT THB ACADEMY
          ======================================================== */}
      <section className="py-20 lg:py-28 bg-white border-t border-[#E7E5DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C58A19]">
              Our Distinction
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#142544]">
              Why Choose THB Academy
            </h2>
            <p className="text-[#647084] text-base">
              A distinctive learning environment built on discipline, authentic mentorship, and stage artistry.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Expert Faculty',
                desc: 'Directed by Taiwo Toyinbo & accomplished music educators with performance backgrounds.',
              },
              {
                title: 'Hands-on Practice',
                desc: 'Instrumental mastery through individualized weekly lessons, ensemble practice, and technique labs.',
              },
              {
                title: 'Flexible Schedules',
                desc: 'Weekday and weekend cohorts tailored for working professionals, students, and children.',
              },
              {
                title: 'Concert Showcases',
                desc: 'Guaranteed stage recitals and live event collaborations to build stage presence and confidence.',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-[#F8F7F4] border border-[#E7E5DF] p-7 rounded-2xl space-y-3.5 hover:border-[#C58A19]/50 hover:bg-white transition-all shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-[#23845B]/10 text-[#23845B] flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h4 className="font-heading font-bold text-lg text-[#142544]">{feature.title}</h4>
                <p className="text-xs sm:text-sm text-[#647084] leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          9. BOTTOM REGISTRATION CALL TO ACTION
          Luxury Navy + Gold container
          ======================================================== */}
      <section className="py-20 lg:py-24 px-4 max-w-7xl mx-auto">
        <div className="bg-[#142544] rounded-3xl p-10 sm:p-16 lg:p-20 text-center text-white relative overflow-hidden shadow-2xl space-y-8">
          {/* Subtle gold decorative radial */}
          <div
            aria-hidden="true"
            className="absolute -top-24 -right-24 w-96 h-96 bg-[#C58A19]/20 rounded-full blur-[100px] pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#243653] rounded-full blur-[100px] pointer-events-none"
          />

          <div className="max-w-3xl mx-auto space-y-4 relative z-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C58A19]/20 border border-[#C58A19]/40 text-[#F8EBCB] text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-[#C58A19]" />
              Begin Your Musical Journey
            </span>

            <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Ready to Master Your Instrument?
            </h2>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Join Triumphant Harmony Brass Music Academy today. Experience personal mentorship,
              graded curricula, and real stage performance opportunities under Taiwo Toyinbo &amp; faculty.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#C58A19] hover:bg-[#b07b14] active:bg-[#9a680c] !text-white font-bold rounded-full text-base transition-all shadow-[0_4px_20px_rgba(197,138,25,0.35)] hover:shadow-[0_6px_25px_rgba(197,138,25,0.45)] transform hover:-translate-y-0.5 cursor-pointer w-full sm:w-auto"
            >
              <span className="!text-white font-bold">Enroll / Register Now</span>
              <ArrowRight className="w-5 h-5 !text-white" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 !text-white border border-white/20 font-semibold rounded-full text-base transition-all backdrop-blur-sm w-full sm:w-auto"
            >
              <span className="!text-white font-semibold">Speak with Admissions</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
