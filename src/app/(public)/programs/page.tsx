import type { Metadata } from 'next';
import Link from 'next/link';
import { getPublishedCourses } from '@/lib/queries/public';
import { formatCurrency } from '@/lib/utils';
import { breadcrumbSchema, JsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Programs',
  description:
    'Explore music programs at Triumphant Harmony Brass. Professional training in keyboard, guitar, trumpet, saxophone, violin, drums, voice, and more.',
};

const levelColors: Record<string, string> = {
  beginner: 'bg-green-500/15 text-green-400 border-green-500/25',
  intermediate: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
  advanced: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
  all_levels: 'bg-brand-500/15 text-brand-400 border-brand-500/25',
};

const levelLabels: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  all_levels: 'All Levels',
};

export default async function ProgramsPage() {
  const courses = await getPublishedCourses();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Programs', url: '/programs' },
        ])}
      />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-navy-950">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-brand-400 font-medium text-sm uppercase tracking-wider mb-3">
            Our Programs
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6">
            Learn Music Your Way
          </h1>
          <p className="text-navy-300 text-lg max-w-2xl mx-auto">
            From beginner to advanced, we offer professional music training across
            a wide range of instruments. Find the perfect program for your musical
            journey.
          </p>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8 bg-navy-950">
        <div className="max-w-7xl mx-auto">
          {courses.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🎵</div>
              <h2 className="text-xl font-semibold text-navy-200 mb-2">
                Programs Coming Soon
              </h2>
              <p className="text-navy-400">
                We&apos;re preparing exciting new programs. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  href={`/programs/${course.slug}`}
                  className="group"
                >
                  <article className="bg-navy-800/80 border border-navy-700/50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:border-navy-600/50 hover:-translate-y-1 h-full flex flex-col">
                    {/* Image */}
                    <div className="h-48 bg-gradient-to-br from-navy-700 to-navy-800 relative overflow-hidden">
                      {course.image_url ? (
                        <img
                          src={course.image_url}
                          alt={course.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-6xl opacity-20">🎶</div>
                        </div>
                      )}
                      {/* Level Badge */}
                      <span
                        className={`absolute top-3 right-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          levelColors[course.level] || levelColors.all_levels
                        }`}
                      >
                        {levelLabels[course.level] || course.level}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      {/* Instrument */}
                      {course.instrument && (
                        <p className="text-brand-400 text-xs font-semibold uppercase tracking-wider mb-2">
                          {course.instrument.name}
                        </p>
                      )}

                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-brand-300 transition-colors">
                        {course.name}
                      </h3>

                      {course.description && (
                        <p className="text-navy-400 text-sm line-clamp-2 mb-4 flex-1">
                          {course.description}
                        </p>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-navy-700/50 mt-auto">
                        <span className="text-brand-400 font-bold text-lg">
                          {formatCurrency(course.price, course.currency)}
                        </span>
                        {course.duration && (
                          <span className="text-navy-500 text-sm">
                            {course.duration}
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-navy-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-navy-300 mb-8">
            Register today and take the first step on your musical journey with
            Triumphant Harmony Brass.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center px-8 py-3 bg-brand-500 text-navy-950 rounded-lg font-semibold hover:bg-brand-400 transition-all duration-200 hover:shadow-glow"
          >
            Get Started
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
