'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X, Save, Loader2, CheckCircle2, AlertCircle, Sparkles, Image as ImageIcon } from 'lucide-react';
import { compressImageFile } from '@/lib/image-utils';
import { savePerformanceGalleryAction } from '@/lib/actions/admin-actions';
import { PerformanceGalleryPhoto } from '@/lib/event-gallery-utils';

interface PerformanceGalleryClientProps {
  initialPhotos: PerformanceGalleryPhoto[];
}

export function PerformanceGalleryManager({ initialPhotos }: PerformanceGalleryClientProps) {
  const router = useRouter();
  const [photos, setPhotos] = useState<PerformanceGalleryPhoto[]>(initialPhotos);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      setErrorMsg('');
      const newPhotos: PerformanceGalleryPhoto[] = [];
      for (const file of files) {
        if (file.type.startsWith('image/')) {
          const compressed = await compressImageFile(file, 1200, 1200, 0.75);
          newPhotos.push({
            id: `perf-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            title: file.name.replace(/\.[^/.]+$/, ''),
            category: 'wedding',
            image_url: compressed,
            caption: '',
          });
        }
      }
      setPhotos((prev) => [...prev, ...newPhotos]);
    } catch {
      setErrorMsg('Failed to process uploaded images. Please select smaller files.');
    }
  };

  const updatePhotoField = (id: string, field: keyof PerformanceGalleryPhoto, value: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSave = async () => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await savePerformanceGalleryAction(photos);
      setLoading(false);
      if (res.success) {
        setSuccessMsg(res.message || 'Gallery updated successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
        router.refresh();
      } else {
        setErrorMsg(res.error || 'Failed to save gallery.');
      }
    } catch (err: unknown) {
      setLoading(false);
      setErrorMsg(err instanceof Error ? err.message : 'Error saving performance gallery');
    }
  };

  return (
    <div className="bg-navy-900/90 border border-navy-700/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-brand-400 font-bold text-xs uppercase tracking-widest mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Service Gallery Management</span>
          </div>
          <h2 className="text-xl font-heading font-bold text-white">Stage & Event Performance Gallery</h2>
          <p className="text-xs text-navy-300">
            Upload and organize performance photos that appear on the public Stage Performances page.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-2.5 bg-brand-500 hover:bg-brand-400 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-glow flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Performance Gallery</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-300 text-sm">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 text-emerald-300 text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Upload Zone */}
      <div className="p-6 bg-navy-950 border border-dashed border-navy-700 rounded-2xl text-center space-y-3">
        <Upload className="w-8 h-8 text-brand-400 mx-auto" />
        <div>
          <h4 className="text-sm font-bold text-white">Upload Performance Photos from Device</h4>
          <p className="text-xs text-navy-400">Support JPG, PNG, WEBP. Photos will be automatically compressed for optimal speed.</p>
        </div>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotoUpload}
          className="hidden"
          id="admin-performance-upload"
        />
        <label
          htmlFor="admin-performance-upload"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy-900 hover:bg-navy-800 border border-navy-700 text-brand-300 text-xs font-bold rounded-xl cursor-pointer transition-colors"
        >
          <ImageIcon className="w-4 h-4" />
          <span>Choose Photos to Add</span>
        </label>
      </div>

      {/* Gallery Photos Grid */}
      {photos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {photos.map((photo) => (
            <div key={photo.id} className="bg-navy-950 border border-navy-800 rounded-xl p-3 space-y-3 relative group">
              <div className="h-40 relative rounded-lg overflow-hidden bg-black">
                <img src={photo.image_url} alt={photo.title} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(photo.id)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-600 text-white rounded-full transition-colors cursor-pointer"
                  title="Remove photo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Title (e.g. Wedding Brass Fanfare)..."
                  value={photo.title}
                  onChange={(e) => updatePhotoField(photo.id, 'title', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-navy-900 border border-navy-800 rounded-lg text-xs text-white placeholder:text-navy-500 focus:border-brand-500 font-bold"
                />

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-navy-400 font-bold uppercase shrink-0">Category:</span>
                  <select
                    value={photo.category}
                    onChange={(e) => updatePhotoField(photo.id, 'category', e.target.value as any)}
                    className="w-full px-2 py-1 bg-navy-900 border border-navy-800 rounded-lg text-xs text-brand-300 focus:border-brand-500 font-medium"
                  >
                    <option value="wedding">Wedding</option>
                    <option value="church">Church Event</option>
                    <option value="concert">Concert</option>
                    <option value="corporate">Corporate</option>
                    <option value="private_event">Private Party</option>
                  </select>
                </div>

                <input
                  type="text"
                  placeholder="Caption (e.g. Performed live in Lagos)..."
                  value={photo.caption}
                  onChange={(e) => updatePhotoField(photo.id, 'caption', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-navy-900 border border-navy-800 rounded-lg text-xs text-navy-200 placeholder:text-navy-500 focus:border-brand-500"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-navy-400 text-xs bg-navy-950/60 rounded-xl border border-navy-800">
          No performance photos added yet. Upload photos above to build the gallery.
        </div>
      )}
    </div>
  );
}
