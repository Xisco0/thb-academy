import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCourseBySlug, getWebsiteSettings } from '@/lib/queries/public';
import { courseSchema, breadcrumbSchema, JsonLd } from '@/lib/seo';
import { formatCurrency } from '@/lib/utils';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return { title: 'Program Not Found' };

  return {
    title: course.seo_title || course.name,
    description:
      course.seo_description || course.description || `Learn ${course.name} at THB Academy`,
  };
}

const levelLabels: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  all_levels: 'All Levels',
};

const levelColors: Record<string, string> = {
  beginner: 'bg-green-500/15 text-green-400 border-green-500/25',
  intermediate: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
  advanced: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
  all_levels: 'bg-brand-500/15 text-brand-400 border-brand-500/25',
};

export default async function ProgramDetailPage({ params }: Props) {
  const { slug } = await params;
  const [course, settings] = await Promise.all([
    getCourseBySlug(slug),
    getWebsiteSettings(),
  ]);

  if (!course) {
    notFound();
  }

  const instructorName = course.instructor
    ? `${course.instructor.first_name} ${course.instructor.last_name}`
    : null;

  return (
    <>
      <JsonLd data={courseSchema(course, settings)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Programs', url: '/programs' },
          { name: course.name, url: `/programs/${course.slug}` },
        ])}
      />

      {/* Header */}
      <section className="pt-32 pb-12 px-4 bg-navy-900 border-b border-navy-800/50">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="text-sm text-navy-400 mb-6">
            <Link href="/" className="hover:text-brand-400 transition-colors">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/programs" className="hover:text-brand-400 transition-colors">Programs</Link>
            <span className="mx-2">›</span>
            <span className="text-navy-200">{course.name}</span>
          </nav>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {course.instrument && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20">
                {course.instrument.name}
              </span>
            )}
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                levelColors[course.level] || levelColors.all_levels
              }`}
            >
              {levelLabels[course.level] || course.level}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-4">
            {course.name}
          </h1>

          {course.description && (
            <p className="text-navy-300 text-lg max-w-3xl">
              {course.description}
            </p>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-10">
            {/* Detailed Content */}
            {course.detailed_content && (
              <div>
                <h2 className="text-2xl font-heading font-bold text-white mb-4">
                  About This Program
                </h2>
                <div className="text-navy-300 leading-relaxed whitespace-pre-wrap">
                  {course.detailed_content}
                </div>
              </div>
            )}

            {/* What You'll Learn */}
            {course.what_you_learn && (
              <div>
                <h2 className="text-2xl font-heading font-bold text-white mb-4">
                  What You&apos;ll Learn
                </h2>
                <div className="text-navy-300 leading-relaxed whitespace-pre-wrap">
                  {course.what_you_learn}
                </div>
              </div>
            )}

            {/* Who Can Join */}
            {course.who_can_join && (
              <div>
                <h2 className="text-2xl font-heading font-bold text-white mb-4">
                  Who Can Join
                </h2>
                <div className="text-navy-300 leading-relaxed whitespace-pre-wrap">
                  {course.who_can_join}
                </div>
              </div>
            )}

            {/* FAQs */}
            {course.faqs && course.faqs.length > 0 && (
              <div>
                <h2 className="text-2xl font-heading font-bold text-white mb-4">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-3">
                  {course.faqs.map((faq, index) => (
                    <details
                      key={index}
                      className="group bg-navy-800/80 border border-navy-700/50 rounded-xl overflow-hidden"
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
                      <div className="px-6 pb-4 text-navy-300 text-sm leading-relaxed border-t border-navy-700/50 pt-3">
                        {faq.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Price Card */}
              <div className="bg-navy-800/80 border border-navy-700/50 rounded-xl p-6">
                <p className="text-brand-400 font-bold text-3xl mb-1">
                  {formatCurrency(course.price, course.currency)}
                </p>
                {course.duration && (
                  <p className="text-navy-400 text-sm mb-6">{course.duration}</p>
                )}

                <Link
                  href="/register"
                  className="block w-full text-center px-6 py-3 bg-brand-500 text-navy-950 rounded-lg font-semibold hover:bg-brand-400 transition-all duration-200 hover:shadow-glow mb-4"
                >
                  Enroll Now
                </Link>

                <Link
                  href="/contact"
                  className="block w-full text-center px-6 py-3 bg-transparent border border-brand-500 text-brand-400 rounded-lg font-medium hover:bg-brand-500/10 transition-colors"
                >
                  Ask a Question
                </Link>
              </div>

              {/* Course Details */}
              <div className="bg-navy-800/80 border border-navy-700/50 rounded-xl p-6 space-y-4">
                <h3 className="text-white font-semibold mb-2">Course Details</h3>

                <div className="flex items-center justify-between py-2 border-b border-navy-700/30">
                  <span className="text-navy-400 text-sm">Level</span>
                  <span className="text-white text-sm font-medium">
                    {levelLabels[course.level] || course.level}
                  </span>
                </div>

                {course.instrument && (
                  <div className="flex items-center justify-between py-2 border-b border-navy-700/30">
                    <span className="text-navy-400 text-sm">Instrument</span>
                    <span className="text-white text-sm font-medium">
                      {course.instrument.name}
                    </span>
                  </div>
                )}

                {course.duration && (
                  <div className="flex items-center justify-between py-2 border-b border-navy-700/30">
                    <span className="text-navy-400 text-sm">Duration</span>
                    <span className="text-white text-sm font-medium">{course.duration}</span>
                  </div>
                )}

                {course.schedule_info && (
                  <div className="flex items-center justify-between py-2 border-b border-navy-700/30">
                    <span className="text-navy-400 text-sm">Schedule</span>
                    <span className="text-white text-sm font-medium">{course.schedule_info}</span>
                  </div>
                )}

                {instructorName && (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-navy-400 text-sm">Instructor</span>
                    <span className="text-white text-sm font-medium">{instructorName}</span>
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
