import { getFeaturedCourses, getUpcomingEvents, getWebsiteSettings } from '@/lib/queries/public';
import { formatCoursePrice } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { Music, ArrowRight, Calendar, MapPin, CheckCircle, Sparkles, BookOpen, Users, Award } from 'lucide-react';
import { LevelBadge } from '@/components/ui/level-badge';

export const metadata: Metadata = {
  title: 'Triumphant Harmony Brass | Music Academy in Lagos, Nigeria',
  description:
    'Learn music at Triumphant Harmony Brass (THB) in Lagos, Nigeria. Professional training in trumpet, saxophone, keyboard, guitar, violin, drums, and voice.',
};

export default async function HomePage() {
  const settings = await getWebsiteSettings();
  const featuredCourses = await getFeaturedCourses();
  const upcomingEvents = await getUpcomingEvents(3);

  const instruments = ['Trumpet', 'Saxophone', 'Keyboard', 'Guitar', 'Violin', 'Drums', 'Trombone', 'Voice'];

  const duplicatedInstruments = [...instruments, ...instruments, ...instruments];

  return (
    <main className="min-h-screen bg-navy-950 text-slate-100 overflow-x-hidden">
      {/* 1. Hero Section */}
      <section id="hero" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex items-center min-h-[90vh] bg-[#090e1a] hero-dark-section">
        {/* Background Image & Gradient Overlay */}
        <div className="absolute inset-0 z-0 bg-[#090e1a]">
          <Image
            src="/bg-images/image.png"
            alt="Triumphant Harmony Brass instrument collection on stage"
            fill
            priority
            sizes="100vw"
            className="object-cover object-right opacity-95"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#090e1a] via-[#090e1a]/90 to-transparent z-10" />
        </div>

        {/* Decorative elements */}
        <div aria-hidden="true" className="absolute top-1/4 left-10 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl mix-blend-screen pointer-events-none animate-pulse z-10"></div>
        <div aria-hidden="true" className="absolute bottom-1/4 right-10 w-80 h-80 bg-gold/5 rounded-full blur-3xl mix-blend-screen pointer-events-none animate-pulse delay-1000 z-10"></div>

        {/* Left-Aligned Container */}
        <div className="container relative z-20 mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-800/80 border border-gold/30 text-gold text-sm font-medium mb-8 animate-fade-in shadow-[0_0_15px_rgba(212,152,42,0.15)]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <span>Welcome to THB Music Academy</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-6 tracking-tight animate-slide-up">
              Triumphant Harmony <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-400">Brass</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 font-body mb-10 animate-slide-up" style={{ animationDelay: '100ms' }}>
              {settings?.tagline || 'The sound of victory, The heart of harmony.'}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-start gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Link
                href="/programs"
                title="Explore Brass Music Programs"
                className="w-full sm:w-auto text-center px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(var(--color-brand-600),0.3)] hover:shadow-[0_0_25px_rgba(var(--color-brand-500),0.5)] transform hover:-translate-y-1"
              >
                Explore Programs
              </Link>
              <Link
                href="/register"
                title="Get Started with Music Lessons"
                className="w-full sm:w-auto text-center px-8 py-4 bg-navy-800 hover:bg-navy-700 border border-navy-600 text-white font-bold rounded-lg transition-all duration-300 hover:border-gold/50 transform hover:-translate-y-1"
              >
                Get Started
              </Link>
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
                  <div>
                    <p className="text-xs text-navy-400">Course Fee</p>
                    <p className="text-lg font-bold text-brand-400">
                      {formatCoursePrice(course.price, course.currency)}
                    </p>
                  </div>
                  <Link
                    href={`/programs/${course.slug}`}
                    className="px-4 py-2 bg-navy-950 hover:bg-navy-800 border border-navy-700 text-white rounded-lg text-xs font-bold transition-colors"
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
            {upcomingEvents.map((ev: any) => (
              <div key={ev.id} className="bg-navy-900/80 border border-navy-700/60 rounded-2xl p-6 space-y-4 hover:border-brand-500/40 transition-all shadow-xl">
                <div className="flex items-center gap-2 text-xs text-brand-400 font-bold">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(ev.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <h3 className="font-heading text-lg font-bold text-white">{ev.title}</h3>
                <p className="text-navy-300 text-xs line-clamp-2">{ev.description}</p>
                {ev.venue_name && (
                  <div className="flex items-center gap-2 text-xs text-navy-400 pt-2 border-t border-navy-800">
                    <MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                    <span className="truncate">{ev.venue_name}</span>
                  </div>
                )}
              </div>
            ))}
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
