'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Edit2, Trash2, X, Loader2, CheckCircle2, AlertCircle, Calendar, MapPin, Image as ImageIcon, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { createEventAction, updateEventAction, deleteEventAction } from '@/lib/actions/admin-actions';
import { compressImageFile } from '@/lib/image-utils';
import { parseEventActivityPhotos, EventActivityPhoto } from '@/lib/event-gallery-utils';

interface EventProps {
  id: string;
  title: string;
  slug: string;
  description?: string;
  detailed_content?: string;
  date: string;
  start_time?: string;
  end_time?: string;
  venue_name?: string;
  venue_address?: string;
  banner_url?: string;
  status: string;
}

export function EventsClient({ events }: { events: EventProps[] }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EventProps | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    detailed_content: '',
    date: new Date().toISOString().split('T')[0],
    start_time: '17:00',
    end_time: '19:30',
    venue_name: 'THB Main Performance Arena',
    venue_address: 'Ikeja, Lagos, Nigeria',
    banner_url: '',
    status: 'published',
  });

  const [activityPhotos, setActivityPhotos] = useState<EventActivityPhoto[]>([]);

  const filtered = events.filter((e) => {
    return e.title.toLowerCase().includes(search.toLowerCase()) || (e.description || '').toLowerCase().includes(search.toLowerCase());
  });

  function openAddModal() {
    setForm({
      title: '',
      slug: '',
      description: '',
      detailed_content: '',
      date: new Date().toISOString().split('T')[0],
      start_time: '17:00',
      end_time: '19:30',
      venue_name: 'THB Main Performance Arena',
      venue_address: 'Ikeja, Lagos, Nigeria',
      banner_url: '',
      status: 'published',
    });
    setActivityPhotos([]);
    setErrorMsg('');
    setSuccessMsg('');
    setIsAddOpen(true);
  }

  function openEditModal(event: EventProps) {
    setEditingItem(event);
    const { cleanContent, photos } = parseEventActivityPhotos(event.detailed_content || null);
    setForm({
      title: event.title || '',
      slug: event.slug || '',
      description: event.description || '',
      detailed_content: cleanContent,
      date: event.date || new Date().toISOString().split('T')[0],
      start_time: event.start_time || '17:00',
      end_time: event.end_time || '19:30',
      venue_name: event.venue_name || 'THB Main Performance Arena',
      venue_address: event.venue_address || 'Lagos, Nigeria',
      banner_url: event.banner_url || '',
      status: event.status || 'published',
    });
    setActivityPhotos(photos);
    setErrorMsg('');
    setSuccessMsg('');
  }

  const handleMultiplePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      setErrorMsg('');
      const newPhotos: EventActivityPhoto[] = [];
      for (const file of files) {
        if (file.type.startsWith('image/')) {
          const compressed = await compressImageFile(file, 1200, 1200, 0.75);
          newPhotos.push({
            id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            url: compressed,
            caption: '',
          });
        }
      }

      setActivityPhotos((prev) => [...prev, ...newPhotos]);
      // If primary banner is not set yet, set the first uploaded photo as primary banner
      if (!form.banner_url && newPhotos.length > 0) {
        setForm((prev) => ({ ...prev, banner_url: newPhotos[0].url }));
      }
    } catch {
      setErrorMsg('Failed to process image uploads. Please try smaller files.');
    }
  };

  const removePhoto = (photoId: string) => {
    setActivityPhotos((prev) => prev.filter((p) => p.id !== photoId));
  };

  const updatePhotoCaption = (photoId: string, caption: string) => {
    setActivityPhotos((prev) => prev.map((p) => (p.id === photoId ? { ...p, caption } : p)));
  };

  const setAsPrimaryBanner = (photoUrl: string) => {
    setForm((prev) => ({ ...prev, banner_url: photoUrl }));
  };

  async function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await createEventAction({
        ...form,
        activity_photos: activityPhotos,
      });
      setLoading(false);

      if (!res.success) {
        setErrorMsg(res.error || 'Failed to create event.');
      } else {
        setSuccessMsg(res.message || 'Event created successfully!');
        setTimeout(() => {
          setIsAddOpen(false);
          router.refresh();
        }, 1200);
      }
    } catch (err: unknown) {
      setLoading(false);
      setErrorMsg(err instanceof Error ? err.message : 'An unexpected error occurred while saving the event.');
    }
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingItem) return;
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await updateEventAction(editingItem.id, {
        ...form,
        activity_photos: activityPhotos,
      });
      setLoading(false);

      if (!res.success) {
        setErrorMsg(res.error || 'Failed to update event.');
      } else {
        setSuccessMsg(res.message || 'Event updated successfully!');
        setTimeout(() => {
          setEditingItem(null);
          router.refresh();
        }, 1200);
      }
    } catch (err: unknown) {
      setLoading(false);
      setErrorMsg(err instanceof Error ? err.message : 'An unexpected error occurred while updating the event.');
    }
  }

  async function handleDelete() {
    if (!deletingId) return;
    setLoading(true);

    try {
      const res = await deleteEventAction(deletingId);
      setLoading(false);
      if (res.success) {
        setDeletingId(null);
        router.refresh();
      } else {
        alert(res.error || 'Failed to delete event.');
      }
    } catch (err: unknown) {
      setLoading(false);
      alert(err instanceof Error ? err.message : 'Error deleting event');
    }
  }

  return (
    <div className="space-y-6">
      {/* Search & Actions Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <input
            type="text"
            placeholder="Search events by title or venue..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-navy-900 border border-navy-700/80 rounded-xl text-sm text-white focus:border-brand-500 focus:outline-none"
          />
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-brand-500 hover:bg-brand-400 text-white font-bold rounded-xl text-sm transition-all shadow-glow flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Event</span>
        </button>
      </div>

      {/* Events Table / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((event) => {
          const { photos } = parseEventActivityPhotos(event.detailed_content || null);
          const banner = event.banner_url || '/images/thb-academy-banner.png';
          return (
            <div
              key={event.id}
              className="bg-navy-900/80 border border-navy-700/60 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="h-44 bg-navy-950 relative overflow-hidden border-b border-navy-800">
                  <img src={banner} alt={event.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3">
                    <Badge variant={event.status === 'published' ? 'default' : 'info'}>
                      {event.status}
                    </Badge>
                  </div>
                  {photos.length > 0 && (
                    <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/80 backdrop-blur-md rounded-md text-[10px] font-bold text-brand-300 flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" />
                      <span>{photos.length} Activity Photos</span>
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-brand-400 font-bold">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(event.date)}</span>
                  </div>

                  <h3 className="font-heading text-lg font-bold text-white line-clamp-1">{event.title}</h3>
                  <p className="text-navy-300 text-xs line-clamp-2 leading-relaxed">{event.description}</p>

                  {event.venue_name && (
                    <div className="flex items-center gap-1.5 text-xs text-navy-400 pt-2 border-t border-navy-800">
                      <MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                      <span className="truncate">{event.venue_name}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-navy-950/80 border-t border-navy-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => openEditModal(event)}
                  className="flex-1 py-2 px-3 bg-navy-900 hover:bg-navy-800 border border-navy-700 text-navy-200 hover:text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Event & Photos</span>
                </button>

                <button
                  onClick={() => setDeletingId(event.id)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl border border-transparent hover:border-red-500/30 transition-colors cursor-pointer"
                  title="Delete Event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE / EDIT MODAL */}
      {(isAddOpen || editingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-navy-900 border border-navy-700 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-navy-800 pb-4">
              <h2 className="text-xl font-heading font-bold text-white">
                {isAddOpen ? 'Create New Event' : 'Edit Event & Activity Photos'}
              </h2>
              <button
                onClick={() => {
                  setIsAddOpen(false);
                  setEditingItem(null);
                }}
                className="p-1 text-navy-400 hover:text-white rounded-lg hover:bg-navy-800"
              >
                <X className="w-5 h-5" />
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

            <form onSubmit={isAddOpen ? handleAddSubmit : handleEditSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-semibold text-navy-200 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500"
                  placeholder="e.g. THB Grand Easter Live Concert"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-200 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-200 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={form.start_time}
                    onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-200 mb-1">Venue Name</label>
                  <input
                    type="text"
                    value={form.venue_name}
                    onChange={(e) => setForm({ ...form, venue_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500"
                    placeholder="THB Concert Hall"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-200 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-200 mb-1">Venue Address</label>
                <input
                  type="text"
                  value={form.venue_address}
                  onChange={(e) => setForm({ ...form, venue_address: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500"
                  placeholder="Ikeja, Lagos, Nigeria"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-200 mb-1">Event Overview & Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500 resize-none"
                  placeholder="Overview of the event..."
                />
              </div>

              {/* PRIMARY BANNER IMAGE */}
              <div className="p-4 bg-navy-950 border border-navy-800 rounded-xl space-y-3">
                <label className="block text-xs font-bold text-brand-400 uppercase tracking-wider">
                  Primary Event Banner Image
                </label>

                {form.banner_url ? (
                  <div className="relative w-full h-36 rounded-xl overflow-hidden border border-brand-500/40 bg-black">
                    <img src={form.banner_url} alt="Banner Preview" className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 right-2 px-2.5 py-1 bg-black/80 text-brand-400 text-[10px] font-bold rounded-md flex items-center gap-1">
                      <Star className="w-3 h-3 text-brand-400" />
                      <span>Primary Social/Hero Banner</span>
                    </span>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-dashed border-navy-700 text-center text-xs text-navy-400">
                    No primary banner set. Upload photos below or select a file.
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        const compressed = await compressImageFile(file, 1200, 1200, 0.75);
                        setForm((prev) => ({ ...prev, banner_url: compressed }));
                      } catch {
                        setErrorMsg('Failed to process banner image.');
                      }
                    }
                  }}
                  className="w-full text-xs text-navy-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-500 file:text-white hover:file:bg-brand-400 cursor-pointer"
                />
              </div>

              {/* MULTIPLE EVENT ACTIVITY PHOTOS */}
              <div className="p-4 bg-navy-950 border border-navy-800 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-brand-400 uppercase tracking-wider">
                    Event Activity Photos ({activityPhotos.length})
                  </label>
                  <span className="text-[11px] text-navy-400">Upload multiple photos of event activities</span>
                </div>

                {/* Upload File Button */}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleMultiplePhotoUpload}
                  className="w-full text-xs text-navy-300 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-navy-900 file:text-brand-300 border border-navy-700 rounded-xl cursor-pointer hover:file:bg-navy-800"
                />

                {/* Activity Photos Grid */}
                {activityPhotos.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {activityPhotos.map((photo, idx) => (
                      <div key={photo.id} className="relative bg-navy-900 border border-navy-800 rounded-xl p-3 space-y-2">
                        <div className="h-28 relative rounded-lg overflow-hidden bg-black">
                          <img src={photo.url} alt={`Activity ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removePhoto(photo.id)}
                            className="absolute top-1.5 right-1.5 p-1 bg-red-500/80 hover:bg-red-600 text-white rounded-full transition-colors cursor-pointer"
                            title="Remove photo"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          {form.banner_url === photo.url ? (
                            <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-brand-500 text-white text-[9px] font-bold rounded-md">
                              Primary Banner
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setAsPrimaryBanner(photo.url)}
                              className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-black/70 hover:bg-brand-500 text-navy-200 hover:text-white text-[9px] font-bold rounded-md transition-colors cursor-pointer"
                            >
                              Make Primary
                            </button>
                          )}
                        </div>

                        <input
                          type="text"
                          placeholder="Photo Caption (e.g. Keyboard Performance)..."
                          value={photo.caption}
                          onChange={(e) => updatePhotoCaption(photo.id, e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-navy-950 border border-navy-800 rounded-lg text-xs text-white placeholder:text-navy-500 focus:border-brand-500"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-navy-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddOpen(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 text-sm text-navy-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-brand-500 hover:bg-brand-400 text-white font-bold rounded-xl text-sm shadow-glow flex items-center gap-2 cursor-pointer"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isAddOpen ? 'Create Event' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-navy-900 border border-navy-700 rounded-2xl p-6 max-w-sm w-full space-y-4 text-center">
            <Trash2 className="w-10 h-10 text-red-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Delete Event?</h3>
            <p className="text-xs text-navy-300">Are you sure you want to delete this event? This action cannot be undone.</p>
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 bg-navy-950 border border-navy-700 text-navy-300 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold"
              >
                {loading ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
