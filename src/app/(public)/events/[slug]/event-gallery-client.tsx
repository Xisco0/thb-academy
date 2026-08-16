'use client';

import React, { useState } from 'react';
import { Camera, X } from 'lucide-react';
import type { EventActivityPhoto } from '@/lib/event-gallery-utils';

export function EventActivityGallery({ photos }: { photos: EventActivityPhoto[] }) {
  const [selectedPhoto, setSelectedPhoto] = useState<EventActivityPhoto | null>(null);

  if (!photos || photos.length === 0) return null;

  return (
    <div className="space-y-6 pt-4">
      <div className="flex items-center gap-2 text-white font-heading font-bold text-2xl border-b border-navy-800 pb-3">
        <Camera className="w-6 h-6 text-brand-400" />
        <h2>Event Activity Photos & Highlights</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo, idx) => (
          <div
            key={photo.id || idx}
            onClick={() => setSelectedPhoto(photo)}
            className="group relative bg-navy-900/90 border border-navy-800 rounded-2xl overflow-hidden cursor-pointer hover:border-brand-500/50 hover:shadow-2xl transition-all duration-300"
          >
            <div className="h-52 relative overflow-hidden bg-navy-950">
              <img
                src={photo.url}
                alt={photo.caption || `Event photo ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-transparent to-transparent opacity-80" />
              {photo.caption && (
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-xs font-semibold text-white line-clamp-2">{photo.caption}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="relative max-w-4xl w-full bg-navy-900 border border-navy-700 rounded-2xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-navy-950/80 hover:bg-navy-800 text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="max-h-[75vh] bg-black flex items-center justify-center overflow-hidden">
              <img src={selectedPhoto.url} alt={selectedPhoto.caption || 'Event Activity Photo'} className="max-h-[75vh] w-auto object-contain" />
            </div>
            {selectedPhoto.caption && (
              <div className="p-4 bg-navy-950 border-t border-navy-800 text-center">
                <p className="text-sm font-medium text-white">{selectedPhoto.caption}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
