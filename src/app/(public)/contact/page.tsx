import { Metadata } from 'next';
import { getWebsiteSettings } from '@/lib/queries/public';
import { getWhatsAppUrl } from '@/lib/utils';
import { organizationSchema, breadcrumbSchema, JsonLd } from '@/lib/seo';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, Sparkles, Award } from 'lucide-react';

const siteUrl = 'https://www.thbacademy.org';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Contact Us | Music Academy Lagos',
  description:
    'Get in touch with Triumphant Harmony Brass Music Academy in Lagos, Nigeria. Contact us by phone (+234 703 859 5356), email, or WhatsApp.',
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
  openGraph: {
    title: 'Contact Us | Triumphant Harmony Brass Music Academy',
    description:
      'Reach out to THB Music Academy in Lagos, Nigeria for course enrollment, inquiries, and music director consultation.',
    url: `${siteUrl}/contact`,
    siteName: 'Triumphant Harmony Brass Music Academy',
    locale: 'en_NG',
    type: 'website',
    images: [
      {
        url: `${siteUrl}/images/image.png`,
        width: 1200,
        height: 630,
        alt: 'Contact THB Music Academy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | Triumphant Harmony Brass Music Academy',
    description:
      'Get in touch with THB Music Academy in Lagos, Nigeria. Contact us by phone, email, or WhatsApp.',
    images: [`${siteUrl}/images/image.png`],
  },
};

export default async function ContactPage() {
  const settings = await getWebsiteSettings();
  const phone = settings?.phone || settings?.contact_phone || '+234 703 859 5356';
  const cleanPhone = phone.replace(/\s+/g, '');
  const email = settings?.email || settings?.contact_email || 'info@thbacademy.org';
  const address = settings?.address || 'Lagos, Nigeria';

  return (
    <main className="min-h-screen bg-white text-[#17243A] pt-24 pb-20">
      <JsonLd data={organizationSchema(settings)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Contact', url: '/contact' },
        ])}
      />

      {/* 1. Hero Section */}
      <section className="relative py-16 md:py-24 px-4 bg-gradient-to-b from-[#F8F7F4] via-white to-white border-b border-[#E7E5DF]">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F8EBCB] text-[#9A680C] text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-[#C58A19]" />
            Admissions &amp; Consultation
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#142544] tracking-tight leading-tight">
            Get in Touch with <br />
            <span className="text-[#C58A19] font-normal italic">
              THB Academy
            </span>
          </h1>
          <p className="text-base sm:text-lg text-[#647084] max-w-2xl mx-auto leading-relaxed pt-2">
            Have questions regarding our music syllabus, class schedules, or booking live musicians?
            We are here to assist you every step of your musical journey.
          </p>
        </div>
      </section>

      {/* 2. Contact Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
          
          {/* Left Column: Contact Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C58A19]">Direct Channels</span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#142544]">
                Contact Information
              </h2>
            </div>

            {/* Founder Note */}
            <div className="p-4 bg-[#F8F7F4] border border-[#E7E5DF] rounded-2xl flex items-center gap-3.5 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#F8EBCB] text-[#C58A19] flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-[#C58A19] font-bold uppercase tracking-wider">Music Director</p>
                <p className="text-[#142544] font-bold text-sm">Taiwo Toyinbo</p>
                <p className="text-xs text-[#647084]">Available for audition assessments &amp; bookings</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Address */}
              <div className="bg-white p-5 rounded-2xl border border-[#E7E5DF] shadow-xs space-y-2">
                <div className="w-9 h-9 rounded-xl bg-[#F8F7F4] text-[#C58A19] flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-sm text-[#142544]">Visit Academy</h3>
                <p className="text-xs text-[#647084] leading-relaxed">{address}</p>
              </div>

              {/* Phone */}
              <div className="bg-white p-5 rounded-2xl border border-[#E7E5DF] shadow-xs space-y-2">
                <div className="w-9 h-9 rounded-xl bg-[#F8F7F4] text-[#C58A19] flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-sm text-[#142544]">Call Office</h3>
                <a href={`tel:${cleanPhone}`} className="text-xs text-[#647084] hover:text-[#C58A19] transition-colors block">
                  {phone}
                </a>
              </div>

              {/* Email */}
              <div className="bg-white p-5 rounded-2xl border border-[#E7E5DF] shadow-xs space-y-2">
                <div className="w-9 h-9 rounded-xl bg-[#F8F7F4] text-[#C58A19] flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-sm text-[#142544]">Email Inquiries</h3>
                <a href={`mailto:${email}`} className="text-xs text-[#647084] hover:text-[#C58A19] transition-colors block truncate">
                  {email}
                </a>
              </div>

              {/* Hours */}
              <div className="bg-white p-5 rounded-2xl border border-[#E7E5DF] shadow-xs space-y-2">
                <div className="w-9 h-9 rounded-xl bg-[#F8F7F4] text-[#C58A19] flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-sm text-[#142544]">Academy Hours</h3>
                <p className="text-xs text-[#647084]">Mon &ndash; Sat, 9am &ndash; 6pm</p>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="bg-[#25D366]/10 p-5 rounded-2xl border border-[#25D366]/30 flex items-center justify-between gap-4">
              <div>
                <h3 className="font-heading font-bold text-sm text-[#142544]">Instant WhatsApp Chat</h3>
                <p className="text-xs text-[#647084]">Get instant answers on admissions &amp; pricing</p>
              </div>
              <a
                href={getWhatsAppUrl('+2347038595356', 'Hi, I would like to know more about enrolling at THB Music Academy.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold rounded-full shadow-xs transition-colors shrink-0"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat Now</span>
              </a>
            </div>
          </div>

          {/* Right Column: Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-[#F8F7F4] p-8 sm:p-10 rounded-3xl border border-[#E7E5DF] shadow-sm">
            <div className="space-y-2 mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C58A19]">Send an Enquiry</span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#142544]">
                Leave Us a Message
              </h2>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-first" className="block text-xs font-semibold text-[#142544] uppercase tracking-wider mb-1.5">
                    First Name
                  </label>
                  <input
                    id="contact-first"
                    type="text"
                    placeholder="e.g. Samuel"
                    className="w-full px-4 py-2.5 bg-white border border-[#E7E5DF] rounded-xl text-[#17243A] text-sm placeholder:text-[#8896AB] focus:outline-none focus:ring-2 focus:ring-[#C58A19]/30 focus:border-[#C58A19]"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="contact-last" className="block text-xs font-semibold text-[#142544] uppercase tracking-wider mb-1.5">
                    Last Name
                  </label>
                  <input
                    id="contact-last"
                    type="text"
                    placeholder="e.g. Adeyemi"
                    className="w-full px-4 py-2.5 bg-white border border-[#E7E5DF] rounded-xl text-[#17243A] text-sm placeholder:text-[#8896AB] focus:outline-none focus:ring-2 focus:ring-[#C58A19]/30 focus:border-[#C58A19]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-semibold text-[#142544] uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="name@example.com"
                    className="w-full px-4 py-2.5 bg-white border border-[#E7E5DF] rounded-xl text-[#17243A] text-sm placeholder:text-[#8896AB] focus:outline-none focus:ring-2 focus:ring-[#C58A19]/30 focus:border-[#C58A19]"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="contact-phone" className="block text-xs font-semibold text-[#142544] uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    placeholder="+234..."
                    className="w-full px-4 py-2.5 bg-white border border-[#E7E5DF] rounded-xl text-[#17243A] text-sm placeholder:text-[#8896AB] focus:outline-none focus:ring-2 focus:ring-[#C58A19]/30 focus:border-[#C58A19]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-interest" className="block text-xs font-semibold text-[#142544] uppercase tracking-wider mb-1.5">
                  Area of Interest
                </label>
                <select
                  id="contact-interest"
                  className="w-full px-4 py-2.5 bg-white border border-[#E7E5DF] rounded-xl text-[#17243A] text-sm focus:outline-none focus:ring-2 focus:ring-[#C58A19]/30 focus:border-[#C58A19]"
                >
                  <option value="enrollment">Course Enrollment (Trumpet, Sax, Piano, etc.)</option>
                  <option value="booking">Book Musicians for an Event</option>
                  <option value="audition">Schedule Audition / Assessment</option>
                  <option value="general">General Inquiries</option>
                </select>
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-semibold text-[#142544] uppercase tracking-wider mb-1.5">
                  Message Details
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  placeholder="Tell us about your musical goals or event requirements..."
                  className="w-full px-4 py-2.5 bg-white border border-[#E7E5DF] rounded-xl text-[#17243A] text-sm placeholder:text-[#8896AB] focus:outline-none focus:ring-2 focus:ring-[#C58A19]/30 focus:border-[#C58A19] resize-y min-h-[110px]"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-[#C58A19] hover:bg-[#b07b14] active:bg-[#9a680c] !text-white font-semibold rounded-full text-sm transition-all shadow-[0_2px_12px_rgba(197,138,25,0.25)] cursor-pointer"
                >
                  <Send className="w-4 h-4 !text-white" />
                  <span className="!text-white font-semibold">Submit Message to Admissions</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 3. Academy Location Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="w-full bg-[#F8F7F4] rounded-3xl border border-[#E7E5DF] p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-white text-[#C58A19] border border-[#E7E5DF] flex items-center justify-center mx-auto shadow-xs">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-lg text-[#142544]">Campus &amp; Studio Locations</h3>
          <p className="text-xs sm:text-sm text-[#647084] max-w-lg mx-auto leading-relaxed">
            Triumphant Harmony Brass Music Academy operates in Lagos, Nigeria with dedicated rehearsal halls, soundproof instrument rooms, and stage recital facilities.
          </p>
        </div>
      </section>
    </main>
  );
}
