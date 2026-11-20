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

  const phoneNum = settings?.phone || settings?.contact_phone || '070 3859 5356';
  const cleanPhone = phoneNum.replace(/\s+/g, '');

  const whatsappMsg = encodeURIComponent(
    `Hello THB Academy,\n\nI would like to enquire about your Stage & Event Performance services.\n\nEvent Type: [Wedding / Church Event / Concert / Corporate Event]\n\nPlease provide me with more information about availability, ensemble options, and booking.\n\nThank you.`
  );

  const filteredGallery = activeCategory === 'all'
    ? displayGallery
    : displayGallery.filter((item) => item.category === activeCategory);

  return (
    <main className="min-h-screen bg-white text-[#17243A] pt-24 pb-20">
      {/* 1. Hero Section */}
      <section className="relative py-16 md:py-24 px-4 bg-gradient-to-b from-[#F8F7F4] via-white to-white border-b border-[#E7E5DF]">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F8EBCB] text-[#9A680C] text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-[#C58A19]" />
            <span>Professional Event Music Services</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#142544] tracking-tight leading-tight">
            Stage &amp; Event <br />
            <span className="text-[#C58A19] font-normal italic">
              Performances
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto text-[#647084] leading-relaxed">
            Transform your special occasions with world-class live music. From grand wedding brass fanfares and solemn church service accompaniments to high-energy concert lineups and corporate galas, THB Academy delivers unforgettable musical excellence.
          </p>

          {/* Quick Action Contact Bar */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
            <a
              href={`tel:${cleanPhone}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#142544] hover:bg-[#243653] text-white font-semibold rounded-full transition-all shadow-xs text-xs sm:text-sm uppercase tracking-wider cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>Call Us: {phoneNum}</span>
            </a>

            <a
              href={`https://api.whatsapp.com/send?phone=2347038595356&text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold rounded-full transition-all shadow-xs text-xs sm:text-sm uppercase tracking-wider cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Enquire on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. Events Covered & Services Offered */}
      <section className="py-20 px-4 max-w-7xl mx-auto space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C58A19]">Our Expertise</span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#142544]">
            Tailored Live Music for Every Event
          </h2>
          <p className="text-[#647084] text-base leading-relaxed">
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
              className="bg-white border border-[#E7E5DF] rounded-2xl p-8 space-y-4 hover:border-[#C58A19]/50 hover:shadow-[0_16px_36px_-6px_rgba(20,37,68,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between shadow-xs"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[#F8EBCB] text-[#C58A19] flex items-center justify-center">
                    <srv.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-[#F8F7F4] border border-[#E7E5DF] text-[#142544] rounded-full">
                    {srv.tag}
                  </span>
                </div>
                <h3 className="font-heading text-xl font-bold text-[#142544]">{srv.title}</h3>
                <p className="text-[#647084] text-xs sm:text-sm leading-relaxed">{srv.desc}</p>
              </div>

              <div className="pt-4 border-t border-[#E7E5DF]">
                <a
                  href={`https://api.whatsapp.com/send?phone=2347038595356&text=${whatsappMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#C58A19] hover:text-[#9A680C] font-semibold text-xs uppercase tracking-wider group"
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
        <div className="bg-[#F8F7F4] border border-[#E7E5DF] rounded-3xl p-8 sm:p-12 shadow-sm space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C58A19]">Ensemble Configurations</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#142544]">
              Available Instrumentalists &amp; Ensembles
            </h2>
            <p className="text-[#647084] text-sm leading-relaxed">
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
              <div key={i} className="bg-white border border-[#E7E5DF] p-4 rounded-xl text-center space-y-1.5 shadow-xs">
                <Music className="w-6 h-6 text-[#C58A19] mx-auto" />
                <h4 className="font-heading font-bold text-sm text-[#142544]">{ens.title}</h4>
                <p className="text-[11px] text-[#647084]">{ens.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Performance Gallery */}
      <section className="py-20 px-4 max-w-7xl mx-auto space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C58A19]">Live Showcase</span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#142544]">
            Performance Gallery
          </h2>
          <p className="text-[#647084] text-sm">
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
                  type="button"
                  onClick={() => setActiveCategory(tab.key)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                    activeCategory === tab.key
                      ? 'bg-[#142544] text-white border-[#142544] shadow-xs'
                      : 'bg-white text-[#647084] border-[#E7E5DF] hover:border-[#CBD5E1] hover:text-[#142544]'
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
                    className="group bg-white border border-[#E7E5DF] rounded-2xl overflow-hidden cursor-pointer hover:border-[#C58A19]/50 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="h-56 relative overflow-hidden bg-[#F8F7F4]">
                      <img
                        src={item.image_url}
                        alt={item.title || 'Performance photo'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#C58A19] text-white rounded inline-block mb-1">
                          {item.category.replace('_', ' ')}
                        </span>
                        <h4 className="text-sm font-bold truncate">{item.title}</h4>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-[#647084] text-sm bg-[#F8F7F4] rounded-2xl border border-[#E7E5DF]">
                No performance photos found in this category.
              </div>
            )}
          </>
        ) : (
          <div className="p-12 text-center bg-[#F8F7F4] border border-[#E7E5DF] rounded-3xl max-w-xl mx-auto space-y-3">
            <Camera className="w-10 h-10 text-[#C58A19] mx-auto" />
            <h3 className="font-heading font-bold text-lg text-[#142544]">Performance Gallery Updating</h3>
            <p className="text-[#647084] text-xs leading-relaxed">
              Performance photos will appear here as soon as management uploads them from the Admin CMS.
            </p>
          </div>
        )}
      </section>

      {/* 5. Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
          <div className="relative max-w-4xl w-full bg-white border border-[#E7E5DF] rounded-2xl overflow-hidden shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white text-[#142544] rounded-full transition-colors cursor-pointer shadow-md"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={selectedImage.image_url}
                alt={selectedImage.title}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
            <div className="p-6 space-y-2 bg-white border-t border-[#E7E5DF]">
              <span className="text-xs font-bold text-[#C58A19] uppercase tracking-wider">
                {selectedImage.category?.replace('_', ' ')}
              </span>
              <h3 className="text-xl font-heading font-bold text-[#142544]">{selectedImage.title}</h3>
              {selectedImage.caption && (
                <p className="text-xs text-[#647084]">{selectedImage.caption}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. Bottom Call to Action */}
      <section className="py-16 px-4 max-w-5xl mx-auto text-center">
        <div className="bg-[#142544] text-white rounded-3xl p-10 sm:p-14 space-y-6 shadow-2xl relative overflow-hidden">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold">
            Ready to Book Musicians for Your Event?
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
            Contact THB Academy management to discuss dates, location, and musical requirements.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <a
              href={`tel:${cleanPhone}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#C58A19] hover:bg-[#b07b14] text-white font-bold px-8 py-3.5 rounded-full transition-all shadow-md text-xs sm:text-sm uppercase tracking-wider"
            >
              <Phone className="w-4 h-4" />
              <span>Call Us Now</span>
            </a>
            <a
              href={`https://api.whatsapp.com/send?phone=2347038595356&text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-8 py-3.5 rounded-full transition-all shadow-md text-xs sm:text-sm uppercase tracking-wider"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Enquire on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
