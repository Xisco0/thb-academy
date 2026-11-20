import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Award, Music, Target, ShieldCheck, Heart, ArrowRight, Sparkles, CheckCircle2, Users, Compass, BookOpen } from 'lucide-react';
import { getWebsiteSettings } from '@/lib/queries/public';
import { organizationSchema, breadcrumbSchema, JsonLd } from '@/lib/seo';

const siteUrl = 'https://www.thbacademy.org';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'About Us | Music Academy in Lagos',
  description:
    'Learn about Triumphant Harmony Brass (THB) Music Academy in Lagos, Nigeria. Founded by Music Director Taiwo Toyinbo. Empowering musicians through practical mastery.',
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    title: 'About Us | Triumphant Harmony Brass Music Academy',
    description:
      'Lagos premier music education institution dedicated to developing world-class musicians through disciplined instruction, personal mentorship, and performance excellence.',
    url: `${siteUrl}/about`,
    siteName: 'Triumphant Harmony Brass Music Academy',
    locale: 'en_NG',
    type: 'website',
    images: [
      {
        url: `${siteUrl}/images/image.png`,
        width: 1200,
        height: 630,
        alt: 'About THB Music Academy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | Triumphant Harmony Brass Music Academy',
    description:
      'Learn about THB Music Academy in Lagos, Nigeria. Founded by Music Director Taiwo Toyinbo.',
    images: [`${siteUrl}/images/image.png`],
  },
};

export default async function AboutPage() {
  const settings = await getWebsiteSettings();

  return (
    <main className="min-h-screen bg-white text-[#17243A] pt-24 pb-20">
      <JsonLd data={organizationSchema(settings)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'About', url: '/about' },
        ])}
      />

      {/* 1. Header / Hero Section */}
      <section className="relative py-16 md:py-24 px-4 bg-gradient-to-b from-[#F8F7F4] via-white to-white border-b border-[#E7E5DF]">
        <div className="max-w-5xl mx-auto text-center space-y-5">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F8EBCB] text-[#9A680C] text-xs font-bold uppercase tracking-widest">
            <Music className="w-3.5 h-3.5 text-[#C58A19]" />
            About THB Music Academy
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#142544] tracking-tight leading-tight">
            The Sound of Victory, <br />
            <span className="text-[#C58A19] font-normal italic">
              The Heart of Harmony.
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto text-[#647084] leading-relaxed pt-2">
            Triumphant Harmony Brass (THB) is Lagos&apos; premier music education institution, dedicated to developing world-class musicians through disciplined instruction, personal mentorship, and performance excellence.
          </p>
        </div>
      </section>

      {/* 2. Prominent Founder & Leadership Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="bg-[#F8F7F4] border border-[#E7E5DF] rounded-3xl p-8 sm:p-12 lg:p-16 shadow-[0_16px_40px_-10px_rgba(20,37,68,0.06)] relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Founder Image Showcase */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative group w-full max-w-md aspect-square rounded-3xl p-2 bg-gradient-to-tr from-[#C58A19] via-[#F8EBCB] to-[#142544] shadow-md">
                <div className="w-full h-full rounded-[22px] overflow-hidden relative bg-[#142544]">
                  <Image
                    src="/images/founder.jpg"
                    alt="Taiwo Toyinbo — Founder & Music Director"
                    width={600}
                    height={600}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                </div>

                {/* Badge Overlay */}
                <div className="absolute -bottom-5 left-6 right-6 bg-white border border-[#E7E5DF] p-4 rounded-2xl shadow-lg flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[#F8EBCB] text-[#C58A19] flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#C58A19] font-bold uppercase tracking-wider">Leadership</p>
                    <p className="text-[#142544] font-heading font-bold text-sm">20+ Years Music Director</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Founder Story Content */}
            <div className="lg:col-span-7 space-y-6 pt-4 lg:pt-0">
              <div className="space-y-2">
                <span className="text-[#C58A19] font-bold text-xs tracking-widest uppercase">
                  Meet Our Leadership
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#142544]">
                  Taiwo Toyinbo
                </h2>
                <p className="text-[#647084] font-medium text-lg">
                  Founder &amp; Music Director
                </p>
              </div>

              <div className="space-y-4 text-[#647084] leading-relaxed text-base">
                <p>
                  Taiwo Toyinbo is a renowned music educator, master brass instructor, and visionary music director with over two decades of professional performance and leadership experience across Nigeria and West Africa.
                </p>
                <p>
                  Founded under his passionate stewardship, <strong className="text-[#142544]">Triumphant Harmony Brass (THB)</strong> was established to bridge the gap between foundational music literacy and high-level artistic performance. His holistic pedagogical framework combines classical rigor, practical performance skills, character development, and musical discipline.
                </p>
                <p>
                  Under his direction, THB has trained hundreds of students across trumpet, trombone, saxophone, keyboard, guitar, violin, drums, and vocal performance — many of whom perform in elite orchestras, church ministries, and contemporary bands.
                </p>
              </div>

              {/* Quote Block */}
              <div className="p-5 rounded-2xl bg-white border-l-4 border-[#C58A19] text-[#142544] italic font-heading text-base leading-relaxed shadow-xs">
                &ldquo;Music is not merely sound; it is the discipline of the spirit, the harmony of the mind, and the celebration of victory in human achievement.&rdquo;
                <span className="block not-italic text-xs font-sans text-[#C58A19] font-bold mt-2">
                  &mdash; Taiwo Toyinbo
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  href="/programs"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#142544] hover:bg-[#243653] !text-white font-semibold rounded-full text-sm transition-all shadow-xs"
                >
                  <span className="!text-white font-semibold">Explore Academic Programs</span>
                  <ArrowRight className="w-4 h-4 !text-white" />
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-[#F8F7F4] text-[#142544] border border-[#E7E5DF] font-semibold rounded-full text-sm transition-all"
                >
                  <span>Request Audition / Consultation</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Mission & Vision */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white border border-[#E7E5DF] rounded-3xl p-8 sm:p-10 space-y-4 hover:border-[#C58A19] hover:shadow-[0_16px_32px_-6px_rgba(20,37,68,0.08)] transition-all duration-300 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#F8EBCB] text-[#C58A19] flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-2xl text-[#142544] font-bold">Our Mission</h3>
            <p className="text-[#647084] leading-relaxed text-sm sm:text-base">
              To provide comprehensive, accessible, and high-caliber music education that unlocks individual creative potential, builds character, instills artistic discipline, and nurtures a lifelong mastery of musical performance.
            </p>
          </div>

          <div className="bg-white border border-[#E7E5DF] rounded-3xl p-8 sm:p-10 space-y-4 hover:border-[#C58A19] hover:shadow-[0_16px_32px_-6px_rgba(20,37,68,0.08)] transition-all duration-300 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#F8EBCB] text-[#C58A19] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-2xl text-[#142544] font-bold">Our Vision</h3>
            <p className="text-[#647084] leading-relaxed text-sm sm:text-base">
              To be the premier music academy in West Africa, globally celebrated for producing exceptional instrumentalists, empowering future music directors, and advancing the transformative power of harmony.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Core Values & What Sets THB Apart */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C58A19]">
            Institutional Pedagogy
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl text-[#142544] font-bold">
            What Sets THB Apart
          </h2>
          <p className="text-[#647084] text-base">
            Built on a foundation of artistic integrity, personal mentorship, and performance excellence.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Award,
              title: 'Master Instructors',
              desc: 'Learn directly from veteran musicians and music directors who actively perform and teach.',
            },
            {
              icon: Music,
              title: 'Structured Curriculum',
              desc: 'From sight-reading to advanced improvisation, our courses build real practical competence.',
            },
            {
              icon: Heart,
              title: 'Live Concert Opportunities',
              desc: 'Gain stage experience through regular recitals, ensemble showcases, and academy concerts.',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-[#F8F7F4] border border-[#E7E5DF] rounded-2xl p-7 space-y-3 hover:border-[#C58A19] hover:bg-white transition-all shadow-xs"
            >
              <div className="w-12 h-12 rounded-xl bg-white text-[#C58A19] flex items-center justify-center shadow-xs">
                <item.icon className="w-6 h-6" />
              </div>
              <h4 className="font-heading text-xl text-[#142544] font-bold">{item.title}</h4>
              <p className="text-[#647084] text-xs sm:text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Call To Action */}
      <section className="py-16 px-4 max-w-5xl mx-auto text-center">
        <div className="bg-[#142544] text-white rounded-3xl p-10 sm:p-14 space-y-6 shadow-2xl relative overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute -top-12 -right-12 w-64 h-64 bg-[#C58A19]/25 rounded-full blur-[80px] pointer-events-none"
          />

          <h2 className="font-heading text-3xl sm:text-4xl font-bold">
            Ready to Begin Your Musical Journey?
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Enroll today at Triumphant Harmony Brass Music Academy under the direct guidance of Taiwo Toyinbo and expert faculty.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4 relative z-10">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-[#C58A19] hover:bg-[#b07b14] !text-white font-bold px-8 py-3.5 rounded-full transition-all shadow-md"
            >
              <span className="!text-white font-bold">Enroll Now</span>
              <ArrowRight className="w-5 h-5 !text-white" />
            </Link>
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 !text-white border border-white/20 font-semibold px-8 py-3.5 rounded-full transition-all"
            >
              <span className="!text-white font-semibold">Browse Programs</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
