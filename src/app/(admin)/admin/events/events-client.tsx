'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Edit2, Trash2, X, Loader2, CheckCircle2, AlertCircle, Calendar, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { createEventAction, updateEventAction, deleteEventAction } from '@/lib/actions/admin-actions';
import { compressImageFile } from '@/lib/image-utils';

interface EventProps {
  id: string;
  title: string;
  slug: string;
  description?: string;
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
    date: new Date().toISOString().split('T')[0],
    start_time: '17:00',
    end_time: '19:30',
    venue_name: 'THB Main Performance Arena',
    venue_address: 'Ikeja, Lagos, Nigeria',
    banner_url: '',
    status: 'published',
  });

  const filtered = events.filter((e) => {
    return e.title.toLowerCase().includes(search.toLowerCase()) || (e.description || '').toLowerCase().includes(search.toLowerCase());
  });

  function openAddModal() {
    setForm({
      title: '',
      slug: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      start_time: '17:00',
      end_time: '19:30',
      venue_name: 'THB Main Performance Arena',
      venue_address: 'Ikeja, Lagos, Nigeria',
      banner_url: '',
      status: 'published',
    });
    setErrorMsg('');
    setSuccessMsg('');
    setIsAddOpen(true);
  }

  function openEditModal(event: EventProps) {
    setEditingItem(event);
    setForm({
      title: event.title || '',
      slug: event.slug || '',
      description: event.description || '',
      date: event.date || new Date().toISOString().split('T')[0],
      start_time: event.start_time || '17:00',
      end_time: event.end_time || '19:30',
      venue_name: event.venue_name || 'THB Main Performance Arena',
      venue_address: event.venue_address || 'Lagos, Nigeria',
      banner_url: event.banner_url || '',
      status: event.status || 'published',
    });
    setErrorMsg('');
    setSuccessMsg('');
  }

  async function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await createEventAction(form);
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
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'An unexpected error occurred while saving the event banner. Please try selecting a smaller image file.');
    }
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingItem) return;
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await updateEventAction(editingItem.id, form);
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
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'An unexpected error occurred while updating the event banner. Please try selecting a smaller image file.');
    }
  }

  async function handleDelete() {
    if (!deletingId) return;
    setLoading(true);
    const res = await deleteEventAction(deletingId);
    setLoading(false);
    setDeletingId(null);
    if (res.success) router.refresh();
  }

  return (
    <div className="space-y-6">
      {/* Top Filter & Add Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-navy-900/80 border border-navy-800 p-4 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-navy-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search events & concert showcases..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-navy-950/80 border border-navy-700/60 rounded-xl text-sm text-white placeholder:text-navy-400 focus:border-brand-500"
          />
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-400 text-white font-bold rounded-xl text-sm transition-all shadow-glow cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Event / Concert</span>
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((evt) => (
          <div key={evt.id} className="bg-navy-900/80 border border-navy-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-brand-500/30 transition-all shadow-lg group">
            <div className="space-y-4 p-5">
              <div className="h-40 bg-navy-950 rounded-xl overflow-hidden relative border border-navy-800">
                {evt.banner_url ? (
                  <img src={evt.banner_url} alt={evt.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-amber-500/40 font-heading">🎺</div>
                )}
                <span className="absolute top-2.5 right-2.5">
                  <Badge variant={evt.status === 'published' ? 'default' : 'info'}>{evt.status}</Badge>
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold font-heading text-white">{evt.title}</h3>
                <p className="text-xs text-navy-300 line-clamp-2 mt-1">{evt.description || 'THB Academy live performance showcase.'}</p>
              </div>

              <div className="space-y-1.5 pt-2 text-xs text-navy-300 border-t border-navy-800">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-brand-400" />
                  <span>{formatDate(evt.date)} {evt.start_time ? `at ${evt.start_time}` : ''}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-brand-400" />
                  <span className="truncate">{evt.venue_name || 'Lagos, Nigeria'}</span>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 bg-navy-950/60 border-t border-navy-800 flex items-center justify-end gap-2">
              <button onClick={() => openEditModal(evt)} className="p-2 text-navy-300 hover:text-white hover:bg-navy-700/60 rounded-lg transition-colors inline-flex items-center gap-1 text-xs">
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button onClick={() => setDeletingId(evt.id)} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors inline-flex items-center gap-1 text-xs">
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Event Modal */}
      {(isAddOpen || editingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-navy-900 border border-navy-700/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-navy-800 bg-navy-950/60">
              <h3 className="font-heading text-lg font-bold text-white">
                {isAddOpen ? 'Add New Live Concert / Event' : 'Edit Event'}
              </h3>
              <button onClick={() => { setIsAddOpen(false); setEditingItem(null); }} className="text-navy-400 hover:text-white p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={isAddOpen ? handleAddSubmit : handleEditSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              {errorMsg && (
                <div className="p-3.5 bg-red-500/15 border border-red-500/30 rounded-xl text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="p-3.5 bg-green-500/15 border border-green-500/30 rounded-xl text-green-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-navy-200 mb-1">Event Title *</label>
                <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500" placeholder="Annual Brass Festival Showcase" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-200 mb-1">Date *</label>
                  <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-200 mb-1">Start Time</label>
                  <input type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-200 mb-1">Venue Name</label>
                  <input type="text" value={form.venue_name} onChange={(e) => setForm({ ...form, venue_name: e.target.value })} className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500" placeholder="THB Concert Hall" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-200 mb-1">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500">
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-200 mb-1">Venue Address</label>
                <input type="text" value={form.venue_address} onChange={(e) => setForm({ ...form, venue_address: e.target.value })} className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500" placeholder="Ikeja, Lagos, Nigeria" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-200 mb-1">Concert / Event Banners (Choose Files from Device)</label>
                <div className="space-y-3">
                  {form.banner_url && (
                    <div className="relative w-full h-32 rounded-xl overflow-hidden border border-brand-500/40 bg-navy-950">
                      <img src={form.banner_url} alt="Featured Banner Preview" className="w-full h-full object-cover" />
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 text-brand-400 text-[10px] font-bold rounded-md">Featured Image</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={async (e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length > 0) {
                        try {
                          setErrorMsg('');
                          const compressed = await compressImageFile(files[0], 1200, 1200, 0.75);
                          setForm({ ...form, banner_url: compressed });
                        } catch (err: any) {
                          setErrorMsg(err.message || 'Failed to process event banner image.');
                        }
                      }
                    }}
                    className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-xs text-navy-300 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-500 file:text-white hover:file:bg-brand-400 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-200 mb-1">Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500 resize-none" placeholder="Concert overview..." />
              </div>

              <div className="pt-4 border-t border-navy-800 flex justify-end gap-3">
                <button type="button" onClick={() => { setIsAddOpen(false); setEditingItem(null); }} className="px-4 py-2 text-sm text-navy-300 hover:text-white">Cancel</button>
                <button type="submit" disabled={loading} className="px-6 py-2.5 bg-brand-500 hover:bg-brand-400 text-white font-bold rounded-xl text-sm shadow-glow flex items-center gap-2">
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isAddOpen ? 'Create Event' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-navy-900 border border-navy-800 rounded-2xl w-full max-w-sm p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-500/15 text-red-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-heading">Delete Event Record?</h3>
            <p className="text-xs text-navy-300 leading-relaxed">Are you sure you want to delete this event? This action cannot be undone.</p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button onClick={() => setDeletingId(null)} className="px-4 py-2 text-sm text-navy-300 hover:text-white">Cancel</button>
              <button onClick={handleDelete} disabled={loading} className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-sm shadow-md">{loading ? 'Deleting...' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
