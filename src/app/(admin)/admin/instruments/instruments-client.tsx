'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2, X, Loader2, CheckCircle2, AlertCircle, Music } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { createInstrumentAction, updateInstrumentAction, deleteInstrumentAction } from '@/lib/actions/admin-actions';

interface InstrumentProps {
  id: string;
  name: string;
  slug?: string;
  category?: string;
  description?: string;
  sort_order?: number;
  is_active?: boolean;
}

export function InstrumentsClient({ instruments }: { instruments: InstrumentProps[] }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InstrumentProps | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const categories = Array.from(
    new Set(instruments.map((i) => i.category || 'General').filter(Boolean))
  );

  const [form, setForm] = useState({
    name: '',
    category: 'Brass',
    description: '',
    sort_order: 0,
    is_active: true,
  });

  const filtered = instruments.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.description || '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === 'all' || (item.category || 'General') === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  function openAddModal() {
    setForm({
      name: '',
      category: 'Brass',
      description: '',
      sort_order: instruments.length + 1,
      is_active: true,
    });
    setErrorMsg('');
    setSuccessMsg('');
    setIsAddOpen(true);
  }

  function openEditModal(item: InstrumentProps) {
    setEditingItem(item);
    setForm({
      name: item.name || '',
      category: item.category || 'Brass',
      description: item.description || '',
      sort_order: item.sort_order || 0,
      is_active: item.is_active ?? true,
    });
    setErrorMsg('');
    setSuccessMsg('');
  }

  async function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const res = await createInstrumentAction(form);
    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Failed to add instrument.');
    } else {
      setSuccessMsg(res.message || 'Instrument added!');
      setTimeout(() => {
        setIsAddOpen(false);
        router.refresh();
      }, 1000);
    }
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingItem) return;
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const res = await updateInstrumentAction(editingItem.id, form);
    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Failed to update instrument.');
    } else {
      setSuccessMsg(res.message || 'Instrument updated!');
      setTimeout(() => {
        setEditingItem(null);
        router.refresh();
      }, 1000);
    }
  }

  async function handleDelete() {
    if (!deletingId) return;
    setLoading(true);
    const res = await deleteInstrumentAction(deletingId);
    setLoading(false);
    setDeletingId(null);
    if (res.success) router.refresh();
  }

  return (
    <div className="space-y-6">
      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-navy-900/80 border border-navy-800 p-4 rounded-2xl">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search instruments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white w-full sm:w-64 focus:border-brand-500"
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={openAddModal}
          className="w-full sm:w-auto px-5 py-2.5 bg-brand-500 hover:bg-brand-400 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-glow cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Instrument</span>
        </button>
      </div>

      {/* Instruments Table / Grid */}
      <div className="bg-navy-900/80 border border-navy-800 rounded-2xl overflow-hidden shadow-xl">
        {filtered.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-navy-800 border border-navy-700 flex items-center justify-center mx-auto text-navy-400">
              <Music className="w-6 h-6" />
            </div>
            <p className="text-lg font-bold text-white">No instruments found</p>
            <p className="text-navy-300 text-xs max-w-sm mx-auto">
              Add your first instrument so it can be selected when registering courses in the academy.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="text-xs font-semibold uppercase text-navy-400 bg-navy-950/80 border-b border-navy-800">
                <tr>
                  <th className="px-6 py-4">Instrument Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Sort Order</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800/60 text-sm">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-navy-800/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-white flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400 shrink-0">
                        <Music className="w-4 h-4" />
                      </div>
                      <span>{item.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="default">{item.category || 'General'}</Badge>
                    </td>
                    <td className="px-6 py-4 text-navy-300 text-xs max-w-xs truncate" title={item.description}>
                      {item.description || '-'}
                    </td>
                    <td className="px-6 py-4 text-navy-200 text-xs font-semibold">
                      #{item.sort_order || 0}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 text-navy-300 hover:text-white hover:bg-navy-800 rounded-lg transition-colors inline-flex items-center gap-1 text-xs"
                        title="Edit Instrument"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingId(item.id)}
                        className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors inline-flex items-center gap-1 text-xs"
                        title="Delete Instrument"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {(isAddOpen || editingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-navy-900 border border-navy-700/80 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl space-y-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-navy-800 bg-navy-950/60">
              <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                <Music className="w-5 h-5 text-brand-400" />
                <span>{isAddOpen ? 'Add New Instrument' : 'Edit Instrument'}</span>
              </h3>
              <button
                onClick={() => {
                  setIsAddOpen(false);
                  setEditingItem(null);
                }}
                className="text-navy-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={isAddOpen ? handleAddSubmit : handleEditSubmit} className="p-6 space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-500/15 border border-red-500/30 rounded-xl text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="p-3 bg-green-500/15 border border-green-500/30 rounded-xl text-green-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-navy-200 mb-1">Instrument Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500"
                  placeholder="e.g. Trumpet, Saxophone, Keyboard, Talking Drum"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-200 mb-1">Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500"
                >
                  <option value="Brass">Brass (Trumpet, Trombone, Tuba, French Horn)</option>
                  <option value="Keyboards">Keyboards & Piano</option>
                  <option value="Percussion">Percussion & Drums (Kit, Talking Drum, Congas)</option>
                  <option value="Woodwinds">Woodwinds (Saxophone, Flute, Clarinet)</option>
                  <option value="Strings">Strings (Guitar, Violin, Bass)</option>
                  <option value="Voice">Voice & Choir</option>
                  <option value="General">General / Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-200 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500"
                  placeholder="Brief description of this instrument track..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-200 mb-1">Display Sort Order</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500"
                />
              </div>

              <div className="pt-4 border-t border-navy-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddOpen(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-navy-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 rounded-xl text-sm font-bold bg-brand-500 hover:bg-brand-400 text-white shadow-glow flex items-center gap-2 cursor-pointer"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isAddOpen ? 'Add Instrument' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-navy-900 border border-navy-700/80 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6 space-y-4">
            <h3 className="font-heading text-lg font-bold text-white">Delete Instrument</h3>
            <p className="text-navy-300 text-xs leading-relaxed">
              Are you sure you want to delete this instrument track? Courses currently linked to it must be updated first.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-navy-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-glow flex items-center gap-2"
              >
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
