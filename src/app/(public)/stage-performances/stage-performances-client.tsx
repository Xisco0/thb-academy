'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Phone, MessageCircle, Music, Sparkles, Award, X, ArrowRight, Building2, Users, Camera } from 'lucide-react';
import type { WebsiteSettings } from '@/types/database.types';
import type { PerformanceGalleryPhoto } from '@/lib/event-gallery-utils';

export function StagePerformancesClient({
  settings,
  initialGalleryPhotos = [],
}: {
  settings: WebsiteSettings | null;
  initialGalleryPhotos?: PerformanceGalleryPhoto[];
}) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<PerformanceGalleryPhoto | null>(null);

  const displayGallery = initialGalleryPhotos;

  const phoneNum = settings?.phone || '070 3859 5356';
  const cleanPhone = phoneNum.replace(/\s+/g, '');

  const whatsappMsg = encodeURIComponent(
    `Hello THB Academy,\n\nI would like to enquire about your Stage & Event Performance services.\n\nEvent Type: [Wedding / Church Event / Concert / Corporate Event]\n\nPlease provide me with more information about availability, ensemble options, and booking.\n\nThank you.`
  );

  const filteredGallery = activeCategory === 'all'
    ? displayGallery
    : displayGallery.filter((item) => item.category === activeCategory);

  return (
    <main className="min-h-screen bg-navy-950 text-slate-100 pt-24 pb-20">
      {/* 1. Hero Section */}
      <section className="relative py-16 md:py-24 px-4 overflow-hidden border-b border-navy-800/80 bg-gradient-to-b from-navy-900 to-navy-950">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <Image
            src="/images/thb-academy-banner.png"
            alt="THB Stage Performance"
            fill
            className="object-cover blur-sm"
          />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span>Professional Event Music Services</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight">
            Stage & Event <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-amber-400 to-amber-500">Performances</span>
          </h1>

          <p className="text-lg md:text-xl max-w-3xl mx-auto text-navy-200 leading-relaxed font-body">
            Transform your special occasions with world-class live music. From grand wedding brass fanfares and solemn church service accompaniments to high-energy concert lineups and corporate galas, THB Academy delivers unforgettable musical excellence.
          </p>

          {/* Quick Action Contact Bar */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
            <a
              href={`tel:${cleanPhone}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-brand-500 hover:bg-brand-400 text-white font-extrabold rounded-xl transition-all shadow-glow text-sm uppercase tracking-wider cursor-pointer"
            >
              <Phone className="w-5 h-5" />
              <span>CALL US: {phoneNum}</span>
            </a>

            <a
              href={`https://api.whatsapp.com/send?phone=2348077566475&text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold rounded-xl transition-all shadow-glow text-sm uppercase tracking-wider cursor-pointer"
            >
              <MessageCircle className="w-5 h-5" />
              <span>ENQUIRE ON WHATSAPP</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. Events Covered & Services Offered */}
      <section className="py-20 px-4 max-w-7xl mx-auto space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-brand-400 font-bold text-xs uppercase tracking-widest">Our Expertise</span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Tailored Live Music for Every Event
          </h2>
          <p className="text-navy-200 text-base leading-relaxed">
            Our accomplished faculty, alumni, and master ensembles provide versatile musical arrangements for a wide range of occasions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: 'Weddings & Celebrations',
              desc: 'Triumphant brass entrances, romantic saxophone serenades, and live party band performances for couples.',
              icon: Award,
              tag: 'Ceremonial & Reception',
            },
            {
              title: 'Church Events & Services',
              desc: 'Hymn accompaniments, brass choir fanfares, choir backing bands, and choir festival orchestration.',
              icon: Building2,
              tag: 'Worship & Anniversaries',
            },
            {
              title: 'Live Concerts & Recitals',
              desc: 'Full stage brass orchestras, solo instrumental features, and collaborative musical productions.',
              icon: Music,
              tag: 'Stage & Festival',
            },
            {
              title: 'Corporate Galas & Dinners',
              desc: 'Sophisticated background jazz, piano lounge music, and dinner banquet brass fanfares.',
              icon: Users,
              tag: 'Corporate & Banquets',
            },
            {
              title: 'Birthday & Anniversary Parties',
              desc: 'Customized live acoustic bands, trumpeter surprises, and interactive musical entertainment.',
              icon: Sparkles,
              tag: 'Milestone Events',
            },
            {
              title: 'Special State & Civic Events',
              desc: 'Official fanfare trumpeters, national anthem brass renditions, and civic ceremony music.',
              icon: Award,
              tag: 'Civic & Ceremonial',
            },
          ].map((srv, i) => (
            <div
              key={i}
              className="bg-navy-900/80 border border-navy-700/60 rounded-2xl p-8 space-y-4 hover:border-brand-500/40 hover:-translate-y-1.5 transition-all duration-300 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400">
                    <srv.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-navy-950 border border-navy-700 text-brand-300 rounded-full">
                    {srv.tag}
                  </span>
                </div>
                <h3 className="font-heading text-xl font-bold text-white">{srv.title}</h3>
                <p className="text-navy-300 text-xs leading-relaxed">{srv.desc}</p>
              </div>

              <div className="pt-4 border-t border-navy-800">
                <a
                  href={`https://api.whatsapp.com/send?phone=2348077566475&text=${whatsappMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-brand-400 hover:text-brand-300 font-bold text-xs uppercase tracking-wider group"
                >
                  <span>Book for your {srv.title.split(' ')[0]}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Available Musicians & Ensembles */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-navy-900 via-navy-900/90 to-navy-950 border border-brand-500/30 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-brand-400 font-bold text-xs uppercase tracking-widest">Ensemble Configurations</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white">
              Available Instrumentalists & Ensembles
            </h2>
            <p className="text-navy-200 text-sm leading-relaxed">
              We provide soloist musicians or full multi-piece bands depending on your event scale.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { title: 'Brass Fanfare', detail: 'Trumpet & Trombone' },
              { title: 'Saxophonists', detail: 'Alto, Tenor & Soprano' },
              { title: 'Keyboardists', detail: 'Pianists & Organists' },
              { title: 'Guitarists', detail: 'Acoustic & Electric' },
              { title: 'Vocalists', detail: 'Soloists & Choirs' },
              { title: 'Rhythm Section', detail: 'Drummers & Percussion' },
            ].map((ens, i) => (
              <div key={i} className="bg-navy-950/80 border border-navy-800 p-4 rounded-xl text-center space-y-1.5">
                <Music className="w-6 h-6 text-brand-400 mx-auto" />
                <h4 className="font-heading font-bold text-sm text-white">{ens.title}</h4>
                <p className="text-[11px] text-navy-400">{ens.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Performance Gallery (STRICTLY FROM ADMIN CMS) */}
      <section className="py-20 px-4 max-w-7xl mx-auto space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-brand-400 font-bold text-xs uppercase tracking-widest">Live Showcase</span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white">
            Performance Gallery
          </h2>
          <p className="text-navy-200 text-sm">
            Live photos of stage performances, weddings, church events, and concerts managed directly by THB Academy.
          </p>
        </div>

        {displayGallery.length > 0 ? (
          <>
            {/* Category Filters */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                { key: 'all', label: 'All Photos' },
                { key: 'wedding', label: 'Weddings' },
                { key: 'church', label: 'Church Events' },
                { key: 'concert', label: 'Concerts' },
                { key: 'corporate', label: 'Corporate' },
                { key: 'private_event', label: 'Private Parties' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveCategory(tab.key)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    activeCategory === tab.key
                      ? 'bg-brand-500 text-white border-brand-400 shadow-glow'
                      : 'bg-navy-900 text-navy-300 border-navy-800 hover:border-brand-500/40 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Gallery Grid */}
            {filteredGallery.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGallery.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedImage(item)}
                    className="group bg-navy-900/80 border border-navy-800 rounded-2xl overflow-hidden cursor-pointer hover:border-brand-500/50 hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="h-56 relative overflow-hidden bg-navy-950">
                      <img
                        src={item.image_url}
                        alt={item.title || 'Performance photo'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent opacity-80" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 bg-brand-500/20 text-brand-300 border border-brand-500/30 rounded-md inline-block mb-1">
                          {item.category.replace('_', ' ')}
                        </span>
                        <h4 className="text-sm font-bold text-white truncate">{item.title}</h4>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-navy-400 text-sm bg-navy-900/40 rounded-2xl border border-navy-800">
                No performance photos found in this category.
              </div>
            )}
          </>
        ) : (
          <div className="p-12 text-center bg-navy-900/50 border border-navy-800 rounded-3xl max-w-xl mx-auto space-y-3">
            <Camera className="w-10 h-10 text-brand-400 mx-auto" />
            <h3 className="text-white font-bold text-lg">Performance Gallery Updating</h3>
            <p className="text-navy-300 text-xs leading-relaxed">
              Performance photos will appear here as soon as management uploads them from the Admin CMS.
            </p>
          </div>
        )}
      </section>

      {/* 5. Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="relative max-w-4xl w-full bg-navy-900 border border-navy-700 rounded-2xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-navy-950/80 hover:bg-navy-800 text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
              <img src={selectedImage.image_url} alt={selectedImage.title} className="max-h-[70vh] w-auto object-contain" />
            </div>
            <div className="p-6 space-y-2 bg-navy-950">
              <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">
                {selectedImage.category?.replace('_', ' ')}
              </span>
              <h3 className="text-xl font-bold text-white">{selectedImage.title}</h3>
              {selectedImage.caption && <p className="text-xs text-navy-300">{selectedImage.caption}</p>}
            </div>
          </div>
        </div>
      )}

      {/* 6. Bottom Call to Action */}
      <section className="py-16 px-4 max-w-5xl mx-auto text-center">
        <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 border border-brand-500/30 rounded-3xl p-10 sm:p-14 space-y-6 shadow-2xl">
          <h2 className="font-heading text-3xl sm:text-4xl text-white font-bold">
            Ready to Book Musicians for Your Event?
          </h2>
          <p className="text-navy-200 text-lg max-w-2xl mx-auto">
            Contact THB Academy management to discuss dates, location, and musical requirements.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`tel:${cleanPhone}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-400 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-glow text-sm uppercase tracking-wider"
            >
              <Phone className="w-5 h-5" />
              <span>Call Us Now</span>
            </a>
            <a
              href={`https://api.whatsapp.com/send?phone=2348077566475&text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-8 py-4 rounded-xl transition-all shadow-glow text-sm uppercase tracking-wider"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Enquire on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
