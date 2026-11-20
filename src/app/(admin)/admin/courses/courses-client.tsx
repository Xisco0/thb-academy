'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Edit2, Trash2, X, Loader2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatCoursePrice } from '@/lib/utils';
import { createCourseAction, updateCourseAction, deleteCourseAction } from '@/lib/actions/admin-actions';

import { LevelBadge } from '@/components/ui/level-badge';
import { compressImageFile } from '@/lib/image-utils';

interface CourseProps {
  id: string;
  name: string;
  slug: string;
  description?: string;
  level: string;
  price: number;
  duration?: string;
  currency: string;
  image_url?: string;
  status: string;
  is_featured: boolean;
  instrument_id: string;
  instructor_id?: string;
  instrument?: { name: string };
  instructor?: { first_name: string; last_name: string };
}

interface MetaProps {
  instruments: { id: string; name: string }[];
  instructors: { id: string; first_name: string; last_name: string }[];
}

export function CoursesClient({ courses, instruments, instructors }: { courses: CourseProps[] } & MetaProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CourseProps | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [form, setForm] = useState({
    name: '',
    slug: '',
    instrument_id: instruments[0]?.id || '',
    instructor_id: '',
    description: '',
    level: 'beginner',
    price: 50000,
    duration: '4 Weeks',
    image_url: '',
    status: 'published',
    is_featured: false,
  });

  const filtered = courses.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || (c.description || '').toLowerCase().includes(search.toLowerCase());
    const matchesLevel = levelFilter === 'all' || c.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  function openAddModal() {
    setForm({
      name: '',
      slug: '',
      instrument_id: instruments[0]?.id || '',
      instructor_id: instructors[0]?.id || '',
      description: '',
      level: 'beginner',
      price: 50000,
      duration: '4 Weeks',
      image_url: '',
      status: 'published',
      is_featured: false,
    });
    setErrorMsg('');
    setSuccessMsg('');
    setIsAddOpen(true);
  }

  function openEditModal(course: CourseProps) {
    setEditingItem(course);
    setForm({
      name: course.name || '',
      slug: course.slug || '',
      instrument_id: course.instrument_id || instruments[0]?.id || '',
      instructor_id: course.instructor_id || '',
      description: course.description || '',
      level: course.level || 'beginner',
      price: course.price || 0,
      duration: course.duration || '4 Weeks',
      image_url: course.image_url || '',
      status: course.status || 'published',
      is_featured: course.is_featured ?? false,
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
      const res = await createCourseAction(form);
      setLoading(false);

      if (!res.success) {
        setErrorMsg(res.error || 'Failed to create course.');
      } else {
        setSuccessMsg(res.message || 'Course created successfully!');
        setTimeout(() => {
          setIsAddOpen(false);
          router.refresh();
        }, 1200);
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'An unexpected error occurred while saving the course. Please try selecting a smaller image file.');
    }
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingItem) return;
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await updateCourseAction(editingItem.id, form);
      setLoading(false);

      if (!res.success) {
        setErrorMsg(res.error || 'Failed to update course.');
      } else {
        setSuccessMsg(res.message || 'Course updated successfully!');
        setTimeout(() => {
          setEditingItem(null);
          router.refresh();
        }, 1200);
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'An unexpected error occurred while updating the course. Please try selecting a smaller image file.');
    }
  }

  async function handleDelete() {
    if (!deletingId) return;
    setLoading(true);
    const res = await deleteCourseAction(deletingId);
    setLoading(false);
    setDeletingId(null);
    if (res.success) router.refresh();
  }

  return (
    <div className="space-y-6">
      {/* Top Filter & Add Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white border border-[#E7E5DF] p-4 rounded-2xl shadow-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8896AB] absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search courses by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] placeholder:text-[#8896AB] focus:border-[#C58A19] focus:bg-white outline-none transition-all"
            />
          </div>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-2 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] focus:border-[#C58A19] outline-none"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#C58A19] hover:bg-[#A37013] text-white font-semibold rounded-full text-sm transition-all shadow-sm cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Course</span>
        </button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((course) => (
          <div key={course.id} className="bg-white border border-[#E7E5DF] rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#C58A19] transition-all shadow-sm hover:shadow-md group">
            <div className="space-y-4 p-5">
              <div className="h-44 bg-[#F8F7F4] rounded-xl overflow-hidden relative border border-[#E7E5DF]">
                {course.image_url ? (
                  <img src={course.image_url} alt={course.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-[#C58A19]/40 font-heading">🎶</div>
                )}
                {course.is_featured && (
                  <span className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-[#C58A19] text-white text-[10px] font-bold rounded-full flex items-center gap-1 shadow-sm">
                    <Sparkles className="w-3 h-3" /> Featured
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-[#C58A19] font-bold uppercase tracking-wider">{course.instrument?.name || 'Music Course'}</span>
                  <LevelBadge level={course.level} />
                </div>
                <h3 className="text-lg font-bold font-heading text-[#142544]">{course.name}</h3>
                <p className="text-xs text-[#647084] line-clamp-2 mt-1">{course.description || 'Professional music training module.'}</p>
              </div>

              <div className="flex items-center justify-between pt-3 text-sm border-t border-[#E7E5DF]">
                <span className="text-xs text-[#647084] font-medium">Duration: <strong className="text-[#142544]">{course.duration || '4 Weeks'}</strong></span>
                <span className="font-bold text-[#C58A19] font-heading">{formatCoursePrice(course.price)}</span>
              </div>
            </div>

            <div className="px-5 py-3 bg-[#F8F7F4]/60 border-t border-[#E7E5DF] flex items-center justify-end gap-2">
              <button onClick={() => openEditModal(course)} className="p-2 text-[#647084] hover:text-[#142544] hover:bg-white rounded-lg transition-colors inline-flex items-center gap-1 text-xs">
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button onClick={() => setDeletingId(course.id)} className="p-2 text-[#DC2626] hover:bg-red-50 rounded-lg transition-colors inline-flex items-center gap-1 text-xs">
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Course Modal */}
      {(isAddOpen || editingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-[#E7E5DF] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E7E5DF] bg-[#F8F7F4]/60">
              <h3 className="font-heading text-lg font-bold text-[#142544]">
                {isAddOpen ? 'Add New Course' : 'Edit Course'}
              </h3>
              <button onClick={() => { setIsAddOpen(false); setEditingItem(null); }} className="text-[#647084] hover:text-[#142544] p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={isAddOpen ? handleAddSubmit : handleEditSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              {errorMsg && (
                <div className="p-3.5 bg-[#FEF2F2] border border-[#FECACA] rounded-xl text-[#991B1B] text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="p-3.5 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl text-[#166534] text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#142544] mb-1">Course Name *</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] focus:border-[#C58A19] focus:bg-white outline-none" placeholder="Keyboard Masterclass" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-[#142544]">Instrument *</label>
                    <a href="/admin/instruments" target="_blank" rel="noreferrer" className="text-[10px] text-[#C58A19] hover:underline">
                      + Add Instrument
                    </a>
                  </div>
                  <select
                    required
                    value={form.instrument_id}
                    onChange={(e) => setForm({ ...form, instrument_id: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] focus:border-[#C58A19] outline-none"
                  >
                    {instruments.length === 0 ? (
                      <option value="">No instruments found (Add instrument first)</option>
                    ) : (
                      instruments.map((inst) => (
                        <option key={inst.id} value={inst.id}>
                          {inst.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#142544] mb-1">Instructor</label>
                  <select value={form.instructor_id} onChange={(e) => setForm({ ...form, instructor_id: e.target.value })} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] focus:border-[#C58A19] outline-none">
                    <option value="">None Assigned</option>
                    {instructors.map((inst) => (
                      <option key={inst.id} value={inst.id}>{inst.first_name} {inst.last_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#142544] mb-1">Skill Level *</label>
                  <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] focus:border-[#C58A19] outline-none">
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="all_levels">All Levels</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#142544] mb-1">Tuition Fee (NGN) *</label>
                  <input type="number" required value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] focus:border-[#C58A19] focus:bg-white outline-none" placeholder="50000" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#142544] mb-1">Duration *</label>
                  <input type="text" required value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] focus:border-[#C58A19] focus:bg-white outline-none" placeholder="e.g. 4 Weeks" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#142544] mb-1">Course Banner Image (Choose File from Device)</label>
                <div className="flex items-center gap-3">
                  {form.image_url && (
                    <img src={form.image_url} alt="Preview" className="w-12 h-12 rounded-xl object-cover border border-[#E7E5DF] shrink-0" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          setErrorMsg('');
                          const compressed = await compressImageFile(file, 1200, 1200, 0.75);
                          setForm({ ...form, image_url: compressed });
                        } catch (err: any) {
                          setErrorMsg(err.message || 'Failed to process image file.');
                        }
                      }
                    }}
                    className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-xs text-[#647084] file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#142544] file:text-white hover:file:bg-[#243653] cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#142544] mb-1">Course Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] focus:border-[#C58A19] focus:bg-white outline-none resize-none" placeholder="Course overview..." />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="is_featured" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="w-4 h-4 rounded text-[#C58A19] focus:ring-[#C58A19]" />
                <label htmlFor="is_featured" className="text-xs font-semibold text-[#142544]">Feature on Homepage</label>
              </div>

              <div className="pt-4 border-t border-[#E7E5DF] flex justify-end gap-3">
                <button type="button" onClick={() => { setIsAddOpen(false); setEditingItem(null); }} className="px-4 py-2 text-sm text-[#647084] hover:text-[#142544]">Cancel</button>
                <button type="submit" disabled={loading} className="px-6 py-2.5 bg-[#C58A19] hover:bg-[#A37013] text-white font-semibold rounded-full text-sm shadow-sm flex items-center gap-2">
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isAddOpen ? 'Create Course' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-[#E7E5DF] rounded-2xl w-full max-w-sm p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-50 text-[#DC2626] flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#142544] font-heading">Delete Course Record?</h3>
            <p className="text-xs text-[#647084] leading-relaxed">Are you sure you want to delete this course? This action cannot be undone.</p>
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
