import { getFeaturedCourses, getUpcomingEvents, getWebsiteSettings } from '@/lib/queries/public';
import { formatCoursePrice } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { Music, ArrowRight, Calendar, MapPin, CheckCircle, Sparkles, BookOpen, Users, Award, ChevronRight } from 'lucide-react';
import { LevelBadge } from '@/components/ui/level-badge';

import { organizationSchema, JsonLd } from '@/lib/seo';

const siteUrl = 'https://www.thbacademy.org';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Triumphant Harmony Brass | Premier Music Academy in Lagos, Nigeria',
  description:
    'Learn music at Triumphant Harmony Brass (THB) Music Academy in Lagos, Nigeria. Professional training in trumpet, saxophone, keyboard, guitar, violin, drums, and voice.',
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'Triumphant Harmony Brass | Premier Music Academy in Lagos, Nigeria',
    description:
      'Premier music education institution in Lagos, Nigeria. Classical rigor, modern technique, and practical performance training under Taiwo Toyinbo & faculty.',
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
  const featuredCourses = await getFeaturedCourses();
  const upcomingEvents = await getUpcomingEvents(3);

  const instruments = ['Trumpet', 'Saxophone', 'Keyboard', 'Guitar', 'Violin', 'Drums', 'Trombone', 'Voice'];

  const duplicatedInstruments = [...instruments, ...instruments, ...instruments];

  return (
    <main className="min-h-screen bg-navy-950 text-slate-100 overflow-x-hidden">
      <JsonLd data={organizationSchema(settings)} />
      {/* 1. Enhanced Hero Section */}
      <section id="hero" className="relative pt-32 pb-24 lg:pt-44 lg:pb-32 overflow-hidden flex items-center min-h-[92vh] bg-[#090e1a] hero-dark-section">
        {/* Background Image & Gradient Overlays */}
        <div className="absolute inset-0 z-0 bg-[#090e1a]">
          <Image
            src="/bg-images/image.png"
            alt="Triumphant Harmony Brass instrument collection on stage"
            fill
            priority
            sizes="100vw"
            className="object-cover object-right opacity-90 scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#090e1a] via-[#090e1a]/95 to-[#090e1a]/70 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090e1a] via-transparent to-[#090e1a]/80 z-10" />
        </div>

        {/* Decorative Ambient Lighting Spheres */}
        <div aria-hidden="true" className="absolute top-1/4 left-10 w-96 h-96 bg-amber-500/15 rounded-full blur-[120px] pointer-events-none z-10 animate-pulse" />
        <div aria-hidden="true" className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none z-10" />

        {/* Container */}
        <div className="container relative z-20 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 text-left space-y-8">
              
              {/* Premier Institution Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-navy-900/90 border border-amber-500/35 text-amber-400 text-xs sm:text-sm font-semibold tracking-wide shadow-[0_0_20px_rgba(245,158,11,0.18)] backdrop-blur-md animate-fade-in">
                <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Premier Music Education Institution in Lagos, Nigeria</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-extrabold text-white tracking-tight leading-[1.1] animate-slide-up">
                Master the Art of Music with <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 drop-shadow-sm">
                  Triumphant Harmony Brass
                </span>
              </h1>

              {/* Tagline & Overview Description */}
              <p className="text-lg sm:text-xl text-slate-300 font-body leading-relaxed max-w-2xl animate-slide-up" style={{ animationDelay: '100ms' }}>
                {settings?.tagline ? (
                  <span>{settings.tagline}</span>
                ) : (
                  <span>
                    Empowering musicians through classical rigor, modern technique, and practical stage performance training under Music Director Taiwo Toyinbo & faculty.
                  </span>
                )}
              </p>

              {/* Action CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 animate-slide-up" style={{ animationDelay: '200ms' }}>
                <Link
                  href="/programs"
                  title="Explore Music Training Programs"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-navy-950 font-extrabold rounded-xl transition-all duration-300 shadow-[0_0_30px_rgba(245,158,11,0.35)] hover:shadow-[0_0_35px_rgba(245,158,11,0.55)] transform hover:-translate-y-0.5 text-base cursor-pointer"
                >
                  <span>Explore Programs</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  href="/register"
                  title="Enroll in Lessons"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-navy-900/80 hover:bg-navy-800 border border-navy-700/80 hover:border-amber-400/50 text-white font-bold rounded-xl transition-all duration-300 backdrop-blur-md transform hover:-translate-y-0.5 text-base cursor-pointer"
                >
                  <span>Enroll / Get Started</span>
                  <ChevronRight className="w-4 h-4 text-amber-400" />
                </Link>
              </div>

              {/* Trust Indicators Bar */}
              <div className="pt-6 border-t border-navy-800/80 grid grid-cols-3 gap-4 max-w-xl text-left animate-slide-up" style={{ animationDelay: '300ms' }}>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold font-heading text-amber-400">500+</div>
                  <div className="text-xs text-slate-400 font-medium mt-0.5">Students Trained</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold font-heading text-amber-400">15+</div>
                  <div className="text-xs text-slate-400 font-medium mt-0.5">Master Instructors</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold font-heading text-amber-400">100%</div>
                  <div className="text-xs text-slate-400 font-medium mt-0.5">Stage & Recital Focus</div>
                </div>
              </div>

            </div>

            {/* Right Feature Showcase Grid Column */}
            <div className="lg:col-span-5 relative">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Feature Card 1 */}
                <div className="p-6 bg-navy-900/70 backdrop-blur-md border border-navy-700/60 hover:border-amber-500/40 rounded-2xl shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Music className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="text-base font-bold text-white font-heading">Brass & Woodwinds</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Trumpet, Saxophone, Trombone, French Horn & Ensemble training.
                  </p>
                </div>

                {/* Feature Card 2 */}
                <div className="p-6 bg-navy-900/70 backdrop-blur-md border border-navy-700/60 hover:border-amber-500/40 rounded-2xl shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="text-base font-bold text-white font-heading">Keyboards & Strings</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Piano, Acoustic/Electric Guitar, Violin, Drums & Vocal Arts.
                  </p>
                </div>

                {/* Feature Card 3 */}
                <div className="p-6 bg-navy-900/70 backdrop-blur-md border border-navy-700/60 hover:border-amber-500/40 rounded-2xl shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="text-base font-bold text-white font-heading">Live Performances</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Stage experience with recitals, concerts & live event bands in Lagos.
                  </p>
                </div>

                {/* Feature Card 4 */}
                <div className="p-6 bg-navy-900/70 backdrop-blur-md border border-navy-700/60 hover:border-amber-500/40 rounded-2xl shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Award className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="text-base font-bold text-white font-heading">Mastery Certificate</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Structured graded curriculum for beginner, intermediate & advanced.
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Marquee Instrument Carousel */}
      <section className="py-6 border-y border-navy-800 bg-navy-900/60 backdrop-blur-md overflow-hidden relative">
        <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee-server {
          display: flex;
          width: max-content;
          animation: marquee 20s linear infinite;
        }
        .animate-marquee-server:hover {
          animation-play-state: paused;
        }
      `}</style>

        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-navy-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-navy-950 to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee flex gap-4 py-2">
          {duplicatedInstruments.map((inst, i) => (
            <div
              key={i}
              className="flex items-center gap-2 shrink-0 px-5 py-2.5 rounded-full bg-navy-950/60 border border-navy-800 text-slate-200 text-sm font-semibold shadow-sm hover:border-amber-400/50 transition-colors"
            >
              <Music className="w-4 h-4 text-amber-400" />
              <span>{inst}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Academy Excellence & Core Pillars */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-navy-900 via-navy-900/90 to-navy-950 border border-brand-500/30 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-brand-400 font-bold text-xs uppercase tracking-widest inline-flex items-center gap-1.5 px-3.5 py-1 bg-brand-500/10 border border-brand-500/20 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              The THB Academy Experience
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              Empowering Musicians Through Practical Mastery
            </h2>
            <p className="text-navy-200 text-base sm:text-lg leading-relaxed">
              We combine classical rigor, modern technique, and stage performance discipline to train well-rounded instrumentalists and vocalists.
            </p>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-navy-950/80 border border-navy-800 p-6 rounded-2xl space-y-3 hover:border-brand-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400 group-hover:scale-110 transition-transform">
                <Music className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-white">Brass & Winds Mastery</h3>
              <p className="text-navy-300 text-xs leading-relaxed">
                Specialized embouchure techniques, breath support, and section control for trumpet, trombone, and saxophone.
              </p>
            </div>

            <div className="bg-navy-950/80 border border-navy-800 p-6 rounded-2xl space-y-3 hover:border-brand-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-white">Harmonic Sight-Reading</h3>
              <p className="text-navy-300 text-xs leading-relaxed">
                Comprehensive piano, keyboard, and guitar chord theory, scale application, and sight-reading fluency.
              </p>
            </div>

            <div className="bg-navy-950/80 border border-navy-800 p-6 rounded-2xl space-y-3 hover:border-brand-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-white">Rhythmic Precision</h3>
              <p className="text-navy-300 text-xs leading-relaxed">
                Practical timing, drum set coordination, and traditional African talking drum grooves for tight rhythm sections.
              </p>
            </div>

            <div className="bg-navy-950/80 border border-navy-800 p-6 rounded-2xl space-y-3 hover:border-brand-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-white">Vocal Excellence</h3>
              <p className="text-navy-300 text-xs leading-relaxed">
                Voice placement, pitch stamina, breathing control, and choir/solo performance arrangements.
              </p>
            </div>
          </div>

          {/* Bottom Stats & CTA */}
          <div className="pt-6 border-t border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full sm:w-auto text-center sm:text-left">
              <div>
                <p className="font-heading text-2xl font-bold text-white">500+</p>
                <p className="text-navy-400 text-xs font-semibold">Trained Musicians</p>
              </div>
              <div>
                <p className="font-heading text-2xl font-bold text-brand-400">8+</p>
                <p className="text-navy-400 text-xs font-semibold">Instrument Tracks</p>
              </div>
              <div>
                <p className="font-heading text-2xl font-bold text-white">20+</p>
                <p className="text-navy-400 text-xs font-semibold">Years Experience</p>
              </div>
              <div>
                <p className="font-heading text-2xl font-bold text-brand-400">100%</p>
                <p className="text-navy-400 text-xs font-semibold">Practical Focus</p>
              </div>
            </div>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-400 text-white font-bold rounded-xl transition-all shadow-glow text-sm shrink-0"
            >
              <span>Learn More About Our Academy</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Featured Programs */}
      <section id="programs" className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-brand-400 font-bold text-xs uppercase tracking-widest">Explore Programs</span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white">
            Featured Music Courses
          </h2>
          <p className="text-navy-200 text-base">
            Professional instruction designed for beginners, intermediate performers, and advanced instrumentalists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCourses?.slice(0, 6).map((course: any) => (
            <div
              key={course.id}
              className="bg-navy-900/80 border border-navy-700/60 rounded-2xl overflow-hidden hover:border-brand-500/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col shadow-xl"
            >
              <div className="h-44 bg-navy-950 relative overflow-hidden border-b border-navy-800">
                {course.image_url ? (
                  <img src={course.image_url} alt={course.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy-900 to-navy-950 p-6 text-center">
                    <Music className="w-12 h-12 text-brand-500/40 mb-2" />
                  </div>
                )}
                <div className="absolute top-3 right-3 z-10">
                  <LevelBadge level={course.level} />
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-heading text-xl font-bold text-white mb-2">{course.name}</h3>
                  <p className="text-navy-300 text-sm line-clamp-2 leading-relaxed">
                    {course.description || 'Comprehensive practical course designed to build musical excellence.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-navy-800 flex items-center justify-between">
                  <span className="text-xs text-navy-400 font-semibold">Practical Training Track</span>
                  <Link
                    href={`/programs/${course.slug}`}
                    className="px-4 py-2 bg-brand-500/10 hover:bg-brand-500 text-brand-400 hover:text-white border border-brand-500/30 rounded-xl text-xs font-bold transition-all"
                  >
                    View Program
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/programs"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-navy-900 hover:bg-navy-800 border border-navy-700 text-brand-400 font-bold rounded-xl transition-all"
          >
            <span>View All Academy Programs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 5. Upcoming Events */}
      {upcomingEvents && upcomingEvents.length > 0 && (
        <section className="py-20 px-4 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-brand-400 font-bold text-xs uppercase tracking-widest">Live Performances</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white">Upcoming Events & Recitals</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((ev: any) => {
              const bannerSrc = ev.banner_url || '/images/thb-academy-banner.png';
              return (
                <Link
                  key={ev.id}
                  href={`/events/${ev.slug}`}
                  className="group bg-navy-900/80 border border-navy-700/60 rounded-2xl overflow-hidden hover:border-brand-500/40 hover:-translate-y-1 transition-all shadow-xl flex flex-col"
                >
                  <div className="h-44 bg-navy-950 relative overflow-hidden border-b border-navy-800">
                    <img src={bannerSrc} alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-brand-400 font-bold">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(ev.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <h3 className="font-heading text-lg font-bold text-white group-hover:text-brand-300 transition-colors">{ev.title}</h3>
                      <p className="text-navy-300 text-xs line-clamp-2 leading-relaxed">{ev.description}</p>
                    </div>

                    {ev.venue_name && (
                      <div className="flex items-center gap-2 text-xs text-navy-400 pt-3 border-t border-navy-800">
                        <MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                        <span className="truncate">{ev.venue_name}</span>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* 6. Why Choose THB */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-brand-400 font-bold text-xs uppercase tracking-widest">Our Difference</span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white">Why Learn at THB Academy</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Expert Faculty', desc: 'Directed by Taiwo Toyinbo & accomplished music educators.' },
            { title: 'Hands-on Practice', desc: 'Focus on instrumental mastery and practical performance skills.' },
            { title: 'Flexible Schedule', desc: 'Classes tailored to fit student availability and skill levels.' },
            { title: 'Concert Showcases', desc: 'Regular live performances to build stage confidence.' },
          ].map((feature, i) => (
            <div key={i} className="bg-navy-900/70 border border-navy-800 p-6 rounded-2xl space-y-3 hover:border-brand-500/30 transition-all">
              <CheckCircle className="w-6 h-6 text-brand-400" />
              <h4 className="font-heading font-bold text-lg text-white">{feature.title}</h4>
              <p className="text-navy-300 text-xs leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Bottom Registration CTA */}
      <section className="py-20 px-4 max-w-5xl mx-auto text-center">
        <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 border border-brand-500/30 rounded-3xl p-10 sm:p-16 space-y-6 shadow-2xl">
          <h2 className="font-heading text-3xl sm:text-5xl font-bold text-white">
            Ready to Begin Your Music Journey?
          </h2>
          <p className="text-navy-200 text-lg max-w-2xl mx-auto">
            Register today and study under the mentorship of Taiwo Toyinbo & the THB faculty.
          </p>
          <div className="pt-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-white font-bold px-10 py-4 rounded-xl transition-all shadow-glow text-lg"
            >
              <span>Register Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
