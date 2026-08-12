import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Award, Music, Target, ShieldCheck, Heart, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | Triumphant Harmony Brass',
  description:
    'Learn about Triumphant Harmony Brass (THB) Music Academy in Lagos, Nigeria. Founded by Music Director Taiwo Toyinbo.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-navy-950 text-slate-100 pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-4 overflow-hidden border-b border-navy-800/80">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-navy-950 to-navy-950 -z-10" />
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-widest">
            <Music className="w-3.5 h-3.5" /> About THB Music Academy
          </span>
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight">
            The Sound of Victory, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-amber-400 to-amber-500">
              The Heart of Harmony.
            </span>
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-navy-200 leading-relaxed pt-2">
            Triumphant Harmony Brass (THB) is Lagos&apos; premier music education institution, dedicated to developing world-class musicians through disciplined instruction, personal mentorship, and performance excellence.
          </p>
        </div>
      </section>

      {/* Prominent Founder Section with Original Image */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-navy-900/90 via-navy-900/50 to-navy-950 border border-brand-500/30 rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Founder Image Showcase */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative group w-full max-w-md aspect-square rounded-3xl p-2 bg-gradient-to-tr from-brand-500 via-amber-400 to-yellow-500 shadow-glow">
                <div className="w-full h-full rounded-[22px] overflow-hidden relative bg-navy-950">
                  <Image
                    src="/images/founder.jpg"
                    alt="Taiwo Toyinbo — Founder & Music Director"
                    width={600}
                    height={600}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent opacity-60" />
                </div>

                {/* Badge Overlay */}
                <div className="absolute -bottom-4 left-6 right-6 bg-navy-900/95 border border-brand-500/40 backdrop-blur-md p-3.5 rounded-2xl shadow-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-brand-400 font-bold uppercase tracking-wider">Leadership</p>
                    <p className="text-white font-heading font-bold text-sm">20+ Years Musical Director</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Founder Story Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-brand-400 font-bold text-sm tracking-widest uppercase">
                  Meet Our Leadership
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                  Taiwo Toyinbo
                </h2>
                <p className="text-brand-300 font-medium text-lg">
                  Founder & Music Director
                </p>
              </div>

              <div className="space-y-4 text-navy-200 leading-relaxed text-base sm:text-lg">
                <p>
                  Taiwo Toyinbo is a renowned music educator, master brass instructor, and visionary music director with over two decades of professional performance and leadership experience across Nigeria and West Africa.
                </p>
                <p>
                  Founded under his passionate stewardship, <strong>Triumphant Harmony Brass (THB)</strong> was established to bridge the gap between foundational music literacy and high-level artistic performance. His holistic pedagogical framework combines classical rigor, practical performance skills, character development, and musical discipline.
                </p>
                <p>
                  Under his direction, THB has trained hundreds of students across trumpet, trombone, saxophone, keyboard, guitar, violin, drums, and vocal performance — many of whom perform in elite orchestras, church ministries, and contemporary bands.
                </p>
              </div>

              {/* Quote Block */}
              <div className="p-5 rounded-2xl bg-navy-950/80 border-l-4 border-brand-500 text-slate-200 italic font-heading text-base leading-relaxed">
                &ldquo;Music is not merely sound; it is the discipline of the spirit, the harmony of the mind, and the celebration of victory in human achievement.&rdquo;
                <span className="block not-italic text-xs font-sans text-brand-400 font-bold mt-2">
                  — Taiwo Toyinbo
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-navy-900/80 border border-navy-700/60 rounded-3xl p-8 sm:p-10 space-y-4 hover:border-brand-500/40 transition-all duration-300 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-2xl text-white font-bold">Our Mission</h3>
            <p className="text-navy-200 leading-relaxed">
              To provide comprehensive, accessible, and high-caliber music education that unlocks individual creative potential, builds character, instills artistic discipline, and nurtures a lifelong mastery of musical performance.
            </p>
          </div>

          <div className="bg-navy-900/80 border border-navy-700/60 rounded-3xl p-8 sm:p-10 space-y-4 hover:border-brand-500/40 transition-all duration-300 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-2xl text-white font-bold">Our Vision</h3>
            <p className="text-navy-200 leading-relaxed">
              To be the premier music academy in West Africa, globally celebrated for producing exceptional instrumentalists, empowering future music directors, and advancing the transformative power of harmony.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-heading text-3xl sm:text-4xl text-white font-bold mb-4">
            What Sets THB Apart
          </h2>
          <p className="text-navy-200 text-lg">
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
              className="bg-navy-900/70 border border-navy-800 rounded-2xl p-6 sm:p-8 space-y-3 hover:border-brand-500/30 hover:-translate-y-1 transition-all"
            >
              <item.icon className="w-8 h-8 text-brand-400" />
              <h4 className="font-heading text-xl text-white font-bold">{item.title}</h4>
              <p className="text-navy-300 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 max-w-5xl mx-auto text-center">
        <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 border border-brand-500/30 rounded-3xl p-10 sm:p-14 space-y-6 shadow-2xl">
          <h2 className="font-heading text-3xl sm:text-4xl text-white font-bold">
            Ready to Begin Your Musical Journey?
          </h2>
          <p className="text-navy-200 text-lg max-w-2xl mx-auto">
            Enroll today at Triumphant Harmony Brass Music Academy under the direct guidance of Taiwo Toyinbo and expert faculty.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-navy-950 font-bold px-8 py-4 rounded-xl transition-all shadow-glow"
            >
              <span>Enroll Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 bg-navy-950/80 hover:bg-navy-950 border border-brand-500/30 text-brand-400 font-bold px-8 py-4 rounded-xl transition-all"
            >
              <span>Browse Programs</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
