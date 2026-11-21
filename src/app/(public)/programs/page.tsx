import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getPublishedCourses } from '@/lib/queries/public';
import { formatCoursePrice } from '@/lib/utils';
import { breadcrumbSchema, JsonLd } from '@/lib/seo';
import { LevelBadge } from '@/components/ui/level-badge';
import { Music, ArrowRight, BookOpen, Sparkles, CheckCircle2, Award, Clock } from 'lucide-react';

const siteUrl = 'https://www.thbacademy.org';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Music Programs & Courses in Lagos | THB Academy',
  description:
    'Explore music training programs at Triumphant Harmony Brass. Professional courses in trumpet, saxophone, keyboard, guitar, violin, drums, and voice.',
  alternates: {
    canonical: `${siteUrl}/programs`,
  },
  openGraph: {
    title: 'Music Programs & Courses | Triumphant Harmony Brass',
    description:
      'Discover beginner, intermediate, and advanced music courses at THB Academy in Lagos, Nigeria.',
    url: `${siteUrl}/programs`,
    siteName: 'Triumphant Harmony Brass Music Academy',
    locale: 'en_NG',
    type: 'website',
    images: [
      {
        url: `${siteUrl}/images/image.png`,
        width: 1200,
        height: 630,
        alt: 'THB Music Academy Programs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Music Programs & Courses | Triumphant Harmony Brass',
    description:
      'Professional music instruction in keyboard, guitar, trumpet, saxophone, violin, drums, and voice.',
    images: [`${siteUrl}/images/image.png`],
  },
};

export default async function ProgramsPage() {
  const courses = await getPublishedCourses();

  return (
    <main className="min-h-screen bg-white text-[#17243A] pt-24 pb-20">
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Programs', url: '/programs' },
        ])}
      />

      {/* 1. Programs Header / Hero */}
      <section className="relative py-16 md:py-24 px-4 bg-gradient-to-b from-[#F8F7F4] via-white to-white border-b border-[#E7E5DF]">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F8EBCB] text-[#9A680C] text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-[#C58A19]" />
            Academic Disciplines &amp; Tracks
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#142544] tracking-tight leading-tight">
            Comprehensive Music <br />
            <span className="text-[#C58A19] font-normal italic">
              Education &amp; Mastery
            </span>
          </h1>
          <p className="text-base sm:text-lg text-[#647084] max-w-2xl mx-auto leading-relaxed pt-2">
            From foundational technique to advanced recital artistry, our accredited curriculum
            is tailored to develop disciplined, confident, and expressive musicians.
          </p>
        </div>
      </section>

      {/* 2. Courses Listing */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {courses.length === 0 ? (
          <div className="text-center py-20 bg-[#F8F7F4] rounded-3xl border border-[#E7E5DF] p-12">
            <div className="w-16 h-16 rounded-full bg-[#F8EBCB] text-[#C58A19] flex items-center justify-center mx-auto mb-4">
              <Music className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-heading font-bold text-[#142544] mb-2">
              Programs Updating
            </h2>
            <p className="text-[#647084] text-sm max-w-md mx-auto mb-6">
              We are finalizing the upcoming term syllabus. Check back shortly or contact admissions.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#142544] hover:bg-[#243653] !text-white text-xs font-semibold rounded-full shadow-xs"
            >
              <span className="!text-white font-semibold">Contact Admissions</span>
              <ArrowRight className="w-4 h-4 !text-white" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <article
                key={course.id}
                className="group bg-white border border-[#E7E5DF] rounded-2xl overflow-hidden hover:border-[#C58A19]/50 hover:shadow-[0_16px_36px_-6px_rgba(20,37,68,0.1)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
              >
                {/* Image */}
                <div className="h-52 bg-[#F8F7F4] relative overflow-hidden border-b border-[#E7E5DF]">
                  {course.image_url ? (
                    <img
                      src={course.image_url}
                      alt={`${course.name} Banner`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                      alt={`${course.name} Banner`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  {/* Level Badge */}
                  <div className="absolute top-3.5 right-3.5 z-10">
                    <LevelBadge level={course.level} />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                  <div className="space-y-2">
                    {course.instrument && (
                      <span className="text-[11px] font-bold text-[#C58A19] uppercase tracking-wider block">
                        {course.instrument.name}
                      </span>
                    )}

                    <h3 className="font-heading text-xl font-bold text-[#142544] group-hover:text-[#C58A19] transition-colors">
                      {course.name}
                    </h3>

                    {course.description && (
                      <p className="text-[#647084] text-xs sm:text-sm line-clamp-3 leading-relaxed">
                        {course.description}
                      </p>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-[#E7E5DF] flex items-center justify-between mt-auto">
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
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F8F7F4] hover:bg-[#142544] text-[#142544] hover:text-white border border-[#E7E5DF] rounded-full text-xs font-semibold transition-all group-hover:border-[#142544]"
                    >
                      <span>View Program</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* 3. Bottom CTA Banner */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <div className="bg-[#142544] text-white rounded-3xl p-10 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute -top-12 -right-12 w-64 h-64 bg-[#C58A19]/25 rounded-full blur-[80px] pointer-events-none"
          />

          <h2 className="font-heading text-3xl sm:text-4xl font-bold">
            Ready to Start Your Training?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Register today and study under the mentorship of Taiwo Toyinbo &amp; our accomplished faculty.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4 relative z-10">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C58A19] hover:bg-[#b07b14] !text-white font-bold rounded-full text-sm transition-all shadow-md"
            >
              <span className="!text-white font-bold">Enroll / Register Account</span>
              <ArrowRight className="w-4 h-4 !text-white" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold rounded-full text-sm transition-all"
            >
              <span>Audition Consultation</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
