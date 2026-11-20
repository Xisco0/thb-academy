'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Edit2, Trash2, X, Loader2, CheckCircle2, AlertCircle, Calendar, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { createScheduleAction, updateScheduleAction, deleteScheduleAction } from '@/lib/actions/admin-actions';

interface ScheduleProps {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  notes?: string;
  course?: { id: string; name: string };
  instructor?: { id: string; first_name: string; last_name: string };
  venue?: { id: string; name: string };
}

interface ScheduleMetaProps {
  courses: { id: string; name: string }[];
  instructors: { id: string; first_name: string; last_name: string }[];
  venues: { id: string; name: string }[];
}

export function SchedulesClient({ schedules, courses, instructors, venues }: { schedules: ScheduleProps[] } & ScheduleMetaProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleProps | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [form, setForm] = useState({
    course_id: courses[0]?.id || '',
    instructor_id: instructors[0]?.id || '',
    venue_id: venues[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    start_time: '10:00',
    end_time: '12:00',
    status: 'scheduled',
    notes: '',
  });

  const filtered = schedules.filter((s) => {
    const courseName = (s.course?.name || '').toLowerCase();
    const instName = `${s.instructor?.first_name || ''} ${s.instructor?.last_name || ''}`.toLowerCase();
    return courseName.includes(search.toLowerCase()) || instName.includes(search.toLowerCase());
  });

  function openAddModal() {
    setForm({
      course_id: courses[0]?.id || '',
      instructor_id: instructors[0]?.id || '',
      venue_id: venues[0]?.id || '',
      date: new Date().toISOString().split('T')[0],
      start_time: '10:00',
      end_time: '12:00',
      status: 'scheduled',
      notes: '',
    });
    setErrorMsg('');
    setSuccessMsg('');
    setIsAddOpen(true);
  }

  function openEditModal(sch: ScheduleProps) {
    setEditingItem(sch);
    setForm({
      course_id: sch.course?.id || courses[0]?.id || '',
      instructor_id: sch.instructor?.id || instructors[0]?.id || '',
      venue_id: sch.venue?.id || venues[0]?.id || '',
      date: sch.date || new Date().toISOString().split('T')[0],
      start_time: sch.start_time || '10:00',
      end_time: sch.end_time || '12:00',
      status: sch.status || 'scheduled',
      notes: sch.notes || '',
    });
    setErrorMsg('');
    setSuccessMsg('');
  }

  async function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const res = await createScheduleAction(form);
    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Failed to create schedule.');
    } else {
      setSuccessMsg(res.message || 'Schedule created!');
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

    const res = await updateScheduleAction(editingItem.id, form);
    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Failed to update schedule.');
    } else {
      setSuccessMsg(res.message || 'Schedule updated!');
      setTimeout(() => {
        setEditingItem(null);
        router.refresh();
      }, 1200);
    }
  }

  async function handleDelete() {
    if (!deletingId) return;
    setLoading(true);
    const res = await deleteScheduleAction(deletingId);
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
            placeholder="Search class schedules by course or instructor..."
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
          <span>Add Class Schedule</span>
        </button>
      </div>

      <div className="bg-white border border-[#E7E5DF] rounded-2xl overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Calendar className="w-12 h-12 text-[#C58A19] mx-auto opacity-40" />
            <p className="text-base font-bold text-[#142544] font-heading">No schedules found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F8F7F4] text-xs font-semibold uppercase tracking-wider text-[#647084] border-b border-[#E7E5DF]">
                <tr>
                  <th className="px-6 py-4">Course</th>
                  <th className="px-6 py-4">Instructor</th>
                  <th className="px-6 py-4">Venue</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E5DF] text-sm">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-[#F8F7F4]/60 transition-colors">
                    <td className="px-6 py-4 font-semibold text-[#142544]">{s.course?.name || 'Music Class'}</td>
                    <td className="px-6 py-4 text-[#647084]">
                      {s.instructor ? `${s.instructor.first_name} ${s.instructor.last_name}` : 'TBD'}
                    </td>
                    <td className="px-6 py-4 text-[#647084]">{s.venue?.name || 'Main Campus'}</td>
                    <td className="px-6 py-4 text-[#647084]">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Clock className="w-3.5 h-3.5 text-[#C58A19]" />
                        <span>{formatDate(s.date)} ({s.start_time} - {s.end_time})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={s.status === 'scheduled' ? 'default' : 'info'}>{s.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => openEditModal(s)} className="p-2 text-[#647084] hover:text-[#142544] hover:bg-[#F8F7F4] rounded-lg transition-colors inline-flex items-center gap-1 text-xs">
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button onClick={() => setDeletingId(s.id)} className="p-2 text-[#DC2626] hover:bg-red-50 rounded-lg transition-colors inline-flex items-center gap-1 text-xs">
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {(isAddOpen || editingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-[#E7E5DF] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E7E5DF] bg-[#F8F7F4]/60">
              <h3 className="font-heading text-lg font-bold text-[#142544]">
                {isAddOpen ? 'Add Class Schedule' : 'Edit Schedule'}
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
                <label className="block text-xs font-semibold text-[#142544] mb-1">Course *</label>
                <select value={form.course_id} onChange={(e) => setForm({ ...form, course_id: e.target.value })} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] focus:border-[#C58A19] outline-none">
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#142544] mb-1">Instructor</label>
                  <select value={form.instructor_id} onChange={(e) => setForm({ ...form, instructor_id: e.target.value })} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] focus:border-[#C58A19] outline-none">
                    <option value="">TBD / Flexible</option>
                    {instructors.map((inst) => (
                      <option key={inst.id} value={inst.id}>{inst.first_name} {inst.last_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#142544] mb-1">Venue</label>
                  <select value={form.venue_id} onChange={(e) => setForm({ ...form, venue_id: e.target.value })} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] focus:border-[#C58A19] outline-none">
                    <option value="">Default Campus</option>
                    {venues.map((v) => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#142544] mb-1">Date *</label>
                  <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-2.5 py-2 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-xs text-[#142544] focus:border-[#C58A19] outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#142544] mb-1">Start Time</label>
                  <input type="time" required value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} className="w-full px-2.5 py-2 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-xs text-[#142544] focus:border-[#C58A19] outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#142544] mb-1">End Time</label>
                  <input type="time" required value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} className="w-full px-2.5 py-2 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-xs text-[#142544] focus:border-[#C58A19] outline-none" />
                </div>
              </div>

              <div className="pt-4 border-t border-[#E7E5DF] flex justify-end gap-3">
                <button type="button" onClick={() => { setIsAddOpen(false); setEditingItem(null); }} className="px-4 py-2 text-sm text-[#647084] hover:text-[#142544]">Cancel</button>
                <button type="submit" disabled={loading} className="px-6 py-2.5 bg-[#C58A19] hover:bg-[#A37013] text-white font-semibold rounded-full text-sm shadow-sm flex items-center gap-2">
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isAddOpen ? 'Create Schedule' : 'Save Changes'}</span>
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
            <h3 className="text-lg font-bold text-[#142544] font-heading">Delete Schedule Record?</h3>
            <p className="text-xs text-[#647084] leading-relaxed">Are you sure you want to delete this schedule? This action cannot be undone.</p>
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
