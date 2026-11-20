'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Edit2, Trash2, X, Loader2, CheckCircle2, AlertCircle, MapPin } from 'lucide-react';
import { createVenueAction, updateVenueAction, deleteVenueAction } from '@/lib/actions/admin-actions';

interface VenueProps {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  capacity?: number;
  is_active: boolean;
}

export function VenuesClient({ venues }: { venues: VenueProps[] }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<VenueProps | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [form, setForm] = useState({
    name: '',
    address: '',
    city: 'Lagos',
    state: 'Lagos',
    capacity: 100,
    is_active: true,
  });

  const filtered = venues.filter((v) => v.name.toLowerCase().includes(search.toLowerCase()) || v.address.toLowerCase().includes(search.toLowerCase()));

  function openAddModal() {
    setForm({
      name: '',
      address: '',
      city: 'Lagos',
      state: 'Lagos',
      capacity: 100,
      is_active: true,
    });
    setErrorMsg('');
    setSuccessMsg('');
    setIsAddOpen(true);
  }

  function openEditModal(v: VenueProps) {
    setEditingItem(v);
    setForm({
      name: v.name || '',
      address: v.address || '',
      city: v.city || 'Lagos',
      state: v.state || 'Lagos',
      capacity: v.capacity || 100,
      is_active: v.is_active ?? true,
    });
    setErrorMsg('');
    setSuccessMsg('');
  }

  async function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const res = await createVenueAction(form);
    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Failed to create venue.');
    } else {
      setSuccessMsg(res.message || 'Venue created!');
      setTimeout(() => {
        setIsAddOpen(false);
        router.refresh();
      }, 1200);
    }
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingItem) return;
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const res = await updateVenueAction(editingItem.id, form);
    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Failed to update venue.');
    } else {
      setSuccessMsg(res.message || 'Venue updated!');
      setTimeout(() => {
        setEditingItem(null);
        router.refresh();
      }, 1200);
    }
  }

  async function handleDelete() {
    if (!deletingId) return;
    setLoading(true);
    const res = await deleteVenueAction(deletingId);
    setLoading(false);
    setDeletingId(null);
    if (res.success) router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white border border-[#E7E5DF] p-4 rounded-2xl shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8896AB] absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search venues..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] placeholder:text-[#8896AB] focus:border-[#C58A19] focus:bg-white outline-none"
          />
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#C58A19] hover:bg-[#A37013] text-white font-semibold rounded-full text-sm transition-all shadow-sm cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Venue</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((v) => (
          <div key={v.id} className="bg-white border border-[#E7E5DF] p-5 rounded-2xl space-y-3 relative flex flex-col justify-between hover:border-[#C58A19] transition-all shadow-sm hover:shadow-md">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#F5F0E6] border border-[#C58A19]/30 text-[#C58A19] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#142544] text-base font-heading">{v.name}</h3>
                  <p className="text-xs text-[#647084]">{v.city}, {v.state}</p>
                </div>
              </div>
              <p className="text-xs text-[#647084]">{v.address}</p>
              <div className="pt-2 text-xs text-[#C58A19] font-medium">Capacity: {v.capacity || 100} Seats</div>
            </div>

            <div className="pt-3 border-t border-[#E7E5DF] flex items-center justify-end gap-2">
              <button onClick={() => openEditModal(v)} className="p-2 text-[#647084] hover:text-[#142544] hover:bg-[#F8F7F4] rounded-lg transition-colors inline-flex items-center gap-1 text-xs">
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button onClick={() => setDeletingId(v.id)} className="p-2 text-[#DC2626] hover:bg-red-50 rounded-lg transition-colors inline-flex items-center gap-1 text-xs">
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {(isAddOpen || editingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-[#E7E5DF] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E7E5DF] bg-[#F8F7F4]/60">
              <h3 className="font-heading text-lg font-bold text-[#142544]">
                {isAddOpen ? 'Add New Venue' : 'Edit Venue'}
              </h3>
              <button onClick={() => { setIsAddOpen(false); setEditingItem(null); }} className="text-[#647084] hover:text-[#142544] p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={isAddOpen ? handleAddSubmit : handleEditSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              {errorMsg && (
                <div className="p-3.5 bg-[#FEF2F2] border border-[#FECACA] rounded-xl text-[#991B1B] text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#DC2626]" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="p-3.5 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl text-[#166534] text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-[#23845B]" />
                  <span>{successMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#142544] mb-1">Venue Name *</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] focus:border-[#C58A19] focus:bg-white outline-none" placeholder="THB Main Rehearsal Hall" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#142544] mb-1">Full Address *</label>
                <input type="text" required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] focus:border-[#C58A19] focus:bg-white outline-none" placeholder="12 Allen Avenue, Ikeja" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#142544] mb-1">City</label>
                  <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] focus:border-[#C58A19] outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#142544] mb-1">State</label>
                  <input type="text" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] focus:border-[#C58A19] outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#142544] mb-1">Capacity</label>
                  <input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] focus:border-[#C58A19] outline-none" />
                </div>
              </div>

              <div className="pt-4 border-t border-[#E7E5DF] flex justify-end gap-3">
                <button type="button" onClick={() => { setIsAddOpen(false); setEditingItem(null); }} className="px-4 py-2 text-sm text-[#647084] hover:text-[#142544]">Cancel</button>
                <button type="submit" disabled={loading} className="px-6 py-2.5 bg-[#C58A19] hover:bg-[#A37013] text-white font-semibold rounded-full text-sm shadow-sm flex items-center gap-2">
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isAddOpen ? 'Create Venue' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-[#E7E5DF] rounded-2xl w-full max-w-sm p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-50 text-[#DC2626] flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#142544] font-heading">Delete Venue Record?</h3>
            <p className="text-xs text-[#647084] leading-relaxed">Are you sure you want to delete this venue? This action cannot be undone.</p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button onClick={() => setDeletingId(null)} className="px-4 py-2 text-sm text-[#647084] hover:text-[#142544]">Cancel</button>
              <button onClick={handleDelete} disabled={loading} className="px-5 py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold rounded-full text-sm shadow-sm">{loading ? 'Deleting...' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
