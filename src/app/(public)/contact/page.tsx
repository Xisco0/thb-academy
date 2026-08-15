import { Metadata } from 'next';
import { getWebsiteSettings } from '@/lib/queries/public';
import { getWhatsAppUrl } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Triumphant Harmony Brass music academy in Lagos, Nigeria. Reach us by phone, email, or WhatsApp.',
};

export default async function ContactPage() {
  const settings = await getWebsiteSettings();

  return (
    <main className="min-h-screen bg-navy-950 text-white pt-24 pb-16">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <p className="text-brand-400 font-medium text-sm uppercase tracking-wider mb-3">
          Contact Us
        </p>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
          Get in Touch
        </h1>
        <p className="text-navy-300 max-w-2xl mx-auto text-lg">
          Have questions about our programs, admissions, or just want to say
          hello? We&apos;d love to hear from you.
        </p>
      </section>

      {/* Contact Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Left: Contact Info */}
          <div className="space-y-6">
            <h2 className="text-2xl font-heading font-bold text-white mb-6">
              Contact Information
            </h2>
            <div className="p-4 bg-navy-900/90 border border-brand-500/30 rounded-xl mb-6">
              <p className="text-xs text-brand-400 font-bold uppercase">Founder & Music Director</p>
              <p className="text-white font-heading font-bold text-base">Taiwo Toyinbo</p>
              <p className="text-xs text-navy-300">Available for academy inquiries & performances</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Address */}
              <div className="bg-navy-800/80 p-6 rounded-xl border border-navy-700/50">
                <svg className="h-8 w-8 text-brand-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3 className="font-semibold text-lg mb-2 text-white">Visit Us</h3>
                <p className="text-navy-300 text-sm">
                  {settings?.address || 'Lagos, Nigeria'}
                  {settings?.city ? `, ${settings.city}` : ''}
                </p>
              </div>

              {/* Phone */}
              <div className="bg-navy-800/80 p-6 rounded-xl border border-navy-700/50">
                <svg className="h-8 w-8 text-brand-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <h3 className="font-semibold text-lg mb-2 text-white">Call Us</h3>
                <p className="text-navy-300 text-sm">
                  {settings?.phone ? (
                    <a href={`tel:${settings.phone}`} className="hover:text-brand-400 transition-colors">
                      {settings.phone}
                    </a>
                  ) : (
                    'Phone number coming soon'
                  )}
                </p>
              </div>

              {/* Email */}
              <div className="bg-navy-800/80 p-6 rounded-xl border border-navy-700/50">
                <svg className="h-8 w-8 text-brand-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h3 className="font-semibold text-lg mb-2 text-white">Email Us</h3>
                <p className="text-navy-300 text-sm break-all">
                  {settings?.email ? (
                    <a href={`mailto:${settings.email}`} className="hover:text-brand-400 transition-colors">
                      {settings.email}
                    </a>
                  ) : (
                    'Email coming soon'
                  )}
                </p>
              </div>

              {/* Hours */}
              <div className="bg-navy-800/80 p-6 rounded-xl border border-navy-700/50">
                <svg className="h-8 w-8 text-brand-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="font-semibold text-lg mb-2 text-white">Business Hours</h3>
                <p className="text-navy-300 text-sm">
                  {settings?.business_hours || 'Monday - Friday, 9am - 6pm'}
                </p>
              </div>
            </div>

            {/* WhatsApp CTA */}
            {settings?.whatsapp && (
              <div className="bg-brand-500/10 p-6 rounded-xl border border-brand-500/20 flex flex-col sm:flex-row items-center gap-6 mt-4">
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-semibold text-lg mb-1 text-white">Chat on WhatsApp</h3>
                  <p className="text-navy-300 text-sm">Get quick answers to your questions</p>
                </div>
                <a
                  href={getWhatsAppUrl(settings.whatsapp, 'Hi, I would like to know more about THB Music Academy.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg font-semibold transition-colors gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.75.75 0 00.918.918l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.387 0-4.598-.836-6.323-2.228l-.384-.318-3.25 1.09 1.09-3.25-.318-.384A9.956 9.956 0 012 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10z" />
                  </svg>
                  WhatsApp Us
                </a>
              </div>
            )}
          </div>

          {/* Right: Contact Form */}
          <div className="bg-navy-800/80 p-8 rounded-2xl border border-navy-700/50">
            <h2 className="text-2xl font-heading font-bold text-white mb-6">
              Send a Message
            </h2>
            <form className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-first" className="block text-sm font-medium text-navy-200 mb-1.5">
                    First Name
                  </label>
                  <input
                    id="contact-first"
                    placeholder="Taiwo"
                    className="w-full px-4 py-2.5 bg-navy-900 border border-navy-600 rounded-lg text-navy-100 text-sm placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500"
                  />
                </div>
                <div>
                  <label htmlFor="contact-last" className="block text-sm font-medium text-navy-200 mb-1.5">
                    Last Name
                  </label>
                  <input
                    id="contact-last"
                    placeholder="Toyinbo"
                    className="w-full px-4 py-2.5 bg-navy-900 border border-navy-600 rounded-lg text-navy-100 text-sm placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium text-navy-200 mb-1.5">
                  Email Address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 bg-navy-900 border border-navy-600 rounded-lg text-navy-100 text-sm placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500"
                />
              </div>

              <div>
                <label htmlFor="contact-subject" className="block text-sm font-medium text-navy-200 mb-1.5">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  placeholder="How can we help you?"
                  className="w-full px-4 py-2.5 bg-navy-900 border border-navy-600 rounded-lg text-navy-100 text-sm placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-navy-200 mb-1.5">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  placeholder="Your message here..."
                  className="w-full px-4 py-2.5 bg-navy-900 border border-navy-600 rounded-lg text-navy-100 text-sm placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 resize-y min-h-[120px]"
                />
              </div>

              <button
                type="button"
                className="w-full px-5 py-3 bg-brand-500 text-white font-bold rounded-lg font-semibold hover:bg-brand-400 transition-all duration-200 hover:shadow-glow"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="w-full h-80 bg-navy-800/50 rounded-2xl border border-navy-700/50 flex items-center justify-center">
          <div className="text-center">
            <svg className="h-12 w-12 text-navy-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-navy-400 text-sm">
              {settings?.address || 'Lagos, Nigeria'}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
