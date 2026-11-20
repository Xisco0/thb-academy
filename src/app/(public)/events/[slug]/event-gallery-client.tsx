'use client';

import React, { useState } from 'react';
import { Camera, X } from 'lucide-react';
import type { EventActivityPhoto } from '@/lib/event-gallery-utils';

export function EventActivityGallery({ photos }: { photos: EventActivityPhoto[] }) {
  const [selectedPhoto, setSelectedPhoto] = useState<EventActivityPhoto | null>(null);

  if (!photos || photos.length === 0) return null;

  return (
    <div className="space-y-6 pt-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo, idx) => (
          <div
            key={photo.id || idx}
            onClick={() => setSelectedPhoto(photo)}
            className="group relative bg-white border border-[#E7E5DF] rounded-2xl overflow-hidden cursor-pointer hover:border-[#C58A19]/50 hover:shadow-lg transition-all duration-300"
          >
            <div className="h-52 relative overflow-hidden bg-[#F8F7F4]">
              <img
                src={photo.url}
                alt={photo.caption || `Event photo ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-75" />
              {photo.caption && (
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-xs font-semibold line-clamp-2">{photo.caption}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
          <div className="relative max-w-4xl w-full bg-white border border-[#E7E5DF] rounded-2xl overflow-hidden shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white text-[#142544] rounded-full transition-colors cursor-pointer shadow-md"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="max-h-[75vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption || 'Event Activity Photo'}
                className="max-h-[75vh] w-auto object-contain"
              />
            </div>
            {selectedPhoto.caption && (
              <div className="p-4 bg-white border-t border-[#E7E5DF] text-center">
                <p className="text-sm font-medium text-[#142544]">{selectedPhoto.caption}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
