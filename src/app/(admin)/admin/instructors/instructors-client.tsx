'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Edit2, Trash2, X, Loader2, UserCheck, AlertCircle, Music } from 'lucide-react';
import { createInstructorAction, updateInstructorAction, deleteInstructorAction } from '@/lib/actions/admin-actions';

interface InstructorProps {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  bio?: string;
  image_url?: string;
  specializations?: string[];
  is_active: boolean;
}

export function InstructorsClient({ instructors }: { instructors: InstructorProps[] }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InstructorProps | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    bio: '',
    image_url: '',
    specializations: '',
    is_active: true,
  });

  const filtered = instructors.filter((inst) => {
    const name = `${inst.first_name || ''} ${inst.last_name || ''}`.toLowerCase();
    const email = (inst.email || '').toLowerCase();
    const bio = (inst.bio || '').toLowerCase();
    return name.includes(search.toLowerCase()) || email.includes(search.toLowerCase()) || bio.includes(search.toLowerCase());
  });

  function openAddModal() {
    setForm({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      bio: '',
      image_url: '',
      specializations: '',
      is_active: true,
    });
    setErrorMsg('');
    setSuccessMsg('');
    setIsAddOpen(true);
  }

  function openEditModal(inst: InstructorProps) {
    setEditingItem(inst);
    setForm({
      first_name: inst.first_name || '',
      last_name: inst.last_name || '',
      email: inst.email || '',
      phone: inst.phone || '',
      bio: inst.bio || '',
      image_url: inst.image_url || '',
      specializations: inst.specializations ? inst.specializations.join(', ') : '',
      is_active: inst.is_active ?? true,
    });
    setErrorMsg('');
    setSuccessMsg('');
  }

  async function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const specs = form.specializations.split(',').map((s) => s.trim()).filter(Boolean);
    const res = await createInstructorAction({
      ...form,
      specializations: specs,
    });
    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Failed to add instructor.');
    } else {
      setSuccessMsg(res.message || 'Instructor added!');
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

    const specs = form.specializations.split(',').map((s) => s.trim()).filter(Boolean);
    const res = await updateInstructorAction(editingItem.id, {
      ...form,
      specializations: specs,
    });
    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Failed to update instructor.');
    } else {
      setSuccessMsg(res.message || 'Instructor updated!');
      setTimeout(() => {
        setEditingItem(null);
        router.refresh();
      }, 1200);
    }
  }

  async function handleDelete() {
    if (!deletingId) return;
    setLoading(true);
    const res = await deleteInstructorAction(deletingId);
    setLoading(false);
    setDeletingId(null);
    if (res.success) router.refresh();
  }

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-navy-900/80 border border-navy-800 p-4 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-navy-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search instructors by name, email, or specialization..."
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
          <span>Add New Instructor</span>
        </button>
      </div>

      {/* Grid of Instructors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((inst) => (
          <div key={inst.id} className="bg-navy-900/80 border border-navy-800 p-6 rounded-2xl space-y-4 relative flex flex-col justify-between hover:border-brand-500/30 transition-all">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-navy-950 border border-brand-500/40 overflow-hidden flex items-center justify-center text-xl font-bold text-brand-400 shrink-0">
                  {inst.image_url ? (
                    <img src={inst.image_url} alt={inst.first_name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{inst.first_name[0]}{inst.last_name[0]}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-base font-bold font-heading text-white">{inst.first_name} {inst.last_name}</h3>
                  <p className="text-xs text-navy-300">{inst.email || 'No email'}</p>
                  <p className="text-xs text-brand-400 font-semibold">{inst.phone || 'No phone'}</p>
                </div>
              </div>
              <p className="text-xs text-navy-300 line-clamp-3 leading-relaxed">{inst.bio || 'Faculty Instructor at THB Music Academy.'}</p>
              
              {inst.specializations && inst.specializations.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {inst.specializations.map((spec, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-brand-500/10 border border-brand-500/20 text-brand-400">
                      <Music className="w-2.5 h-2.5" />
                      {spec}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-navy-800 flex items-center justify-end gap-2">
              <button
                onClick={() => openEditModal(inst)}
                className="p-2 text-navy-300 hover:text-white hover:bg-navy-700/60 rounded-lg transition-colors inline-flex items-center gap-1 text-xs"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => setDeletingId(inst.id)}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors inline-flex items-center gap-1 text-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {(isAddOpen || editingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-navy-900 border border-navy-700/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-navy-800 bg-navy-950/60">
              <h3 className="font-heading text-lg font-bold text-white">
                {isAddOpen ? 'Add New Instructor' : 'Edit Instructor'}
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
                  <UserCheck className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-200 mb-1">First Name *</label>
                  <input type="text" required value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500" placeholder="Taiwo" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-200 mb-1">Last Name *</label>
                  <input type="text" required value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500" placeholder="Toyinbo" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-200 mb-1">Email Address</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500" placeholder="instructor@thb.org" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-200 mb-1">Phone Number</label>
                  <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500" placeholder="08144326123" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-200 mb-1">Specializations (comma separated)</label>
                <input type="text" value={form.specializations} onChange={(e) => setForm({ ...form, specializations: e.target.value })} className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500" placeholder="Trumpet, Saxophone, Brass Ensemble" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-200 mb-1">Instructor Photo (Choose File from Device)</label>
                <div className="flex items-center gap-3">
                  {form.image_url && (
                    <img src={form.image_url} alt="Preview" className="w-12 h-12 rounded-xl object-cover border border-brand-500/40 shrink-0" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setForm({ ...form, image_url: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-xs text-navy-300 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-500 file:text-white hover:file:bg-brand-400 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-200 mb-1">Biography</label>
                <textarea rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500 resize-none" placeholder="Accomplished brass director..." />
              </div>

              <div className="pt-4 border-t border-navy-800 flex justify-end gap-3">
                <button type="button" onClick={() => { setIsAddOpen(false); setEditingItem(null); }} className="px-4 py-2 text-sm text-navy-300 hover:text-white">Cancel</button>
                <button type="submit" disabled={loading} className="px-6 py-2.5 bg-brand-500 hover:bg-brand-400 text-white font-bold rounded-xl text-sm shadow-glow flex items-center gap-2">
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isAddOpen ? 'Add Instructor' : 'Save Changes'}</span>
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
            <h3 className="text-lg font-bold text-white font-heading">Delete Instructor Record?</h3>
            <p className="text-xs text-navy-300 leading-relaxed">Are you sure you want to delete this instructor? This action cannot be undone.</p>
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
