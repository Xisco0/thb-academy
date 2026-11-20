'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Edit2, Trash2, X, Loader2, UserCheck, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { createStudentAction, updateStudentAction, deleteStudentAction } from '@/lib/actions/admin-actions';

interface StudentProps {
  id: string;
  status: string;
  created_at: string;
  profile: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
  };
  gender?: string;
  date_of_birth?: string;
  address?: string;
}

export function StudentsClient({ students }: { students: StudentProps[] }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentProps | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    gender: 'male',
    date_of_birth: '',
    address: '',
    status: 'active',
  });

  const filtered = students.filter((s) => {
    const p = s.profile || {};
    const fullName = `${p.first_name || ''} ${p.last_name || ''}`.toLowerCase();
    const email = (p.email || '').toLowerCase();
    const phone = p.phone || '';
    const matchesSearch =
      fullName.includes(search.toLowerCase()) ||
      email.includes(search.toLowerCase()) ||
      phone.includes(search);
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  function openAddModal() {
    setForm({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      gender: 'male',
      date_of_birth: '',
      address: '',
      status: 'active',
    });
    setErrorMsg('');
    setSuccessMsg('');
    setIsAddOpen(true);
  }

  function openEditModal(student: StudentProps) {
    const p = student.profile || {};
    setEditingStudent(student);
    setForm({
      first_name: p.first_name || '',
      last_name: p.last_name || '',
      email: p.email || '',
      phone: p.phone || '',
      gender: student.gender || 'male',
      date_of_birth: student.date_of_birth || '',
      address: student.address || '',
      status: student.status || 'active',
    });
    setErrorMsg('');
    setSuccessMsg('');
  }

  async function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const res = await createStudentAction(form);
    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Failed to create student.');
    } else {
      setSuccessMsg(res.message || 'Student created!');
      setTimeout(() => {
        setIsAddOpen(false);
        router.refresh();
      }, 1200);
    }
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingStudent) return;
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const res = await updateStudentAction(editingStudent.id, form);
    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Failed to update student.');
    } else {
      setSuccessMsg(res.message || 'Student updated!');
      setTimeout(() => {
        setEditingStudent(null);
        router.refresh();
      }, 1200);
    }
  }

  async function handleDelete() {
    if (!deletingId) return;
    setLoading(true);
    const res = await deleteStudentAction(deletingId);
    setLoading(false);
    setDeletingId(null);
    if (res.success) {
      router.refresh();
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Action & Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white border border-[#E7E5DF] p-4 rounded-2xl shadow-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8896AB] absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] placeholder:text-[#8896AB] focus:border-[#C58A19] focus:bg-white outline-none transition-all"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] focus:border-[#C58A19] outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="registered">Registered</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#C58A19] hover:bg-[#A37013] text-white font-semibold rounded-full text-sm transition-all shadow-sm cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Student List Data Table */}
      <div className="bg-white border border-[#E7E5DF] rounded-2xl overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <UserCheck className="w-12 h-12 text-[#C58A19] mx-auto opacity-40" />
            <p className="text-lg font-bold text-[#142544] font-heading">No students found</p>
            <p className="text-[#647084] text-xs max-w-xs mx-auto">
              {search ? 'Try adjusting your search filter.' : 'Click "Add New Student" above to register your first student.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F8F7F4] text-xs font-semibold uppercase tracking-wider text-[#647084] border-b border-[#E7E5DF]">
                <tr>
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date Joined</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E5DF] text-sm">
                {filtered.map((s) => {
                  const p = s.profile || {};
                  return (
                    <tr key={s.id} className="hover:bg-[#F8F7F4]/60 transition-colors">
                      <td className="px-6 py-4 font-semibold text-[#142544]">
                        {p.first_name} {p.last_name}
                      </td>
                      <td className="px-6 py-4 text-[#647084]">{p.email}</td>
                      <td className="px-6 py-4 text-[#647084]">{p.phone || '-'}</td>
                      <td className="px-6 py-4">
                        <Badge variant={s.status === 'active' ? 'default' : 'info'}>
                          {s.status || 'Active'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-[#8896AB] text-xs">{formatDate(s.created_at)}</td>
                      <td className="px-6 py-4 text-right space-x-1">
                        <button
                          onClick={() => openEditModal(s)}
                          className="p-2 text-[#647084] hover:text-[#142544] hover:bg-[#F8F7F4] rounded-lg transition-colors inline-flex items-center"
                          title="Edit Student"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(s.id)}
                          className="p-2 text-[#DC2626] hover:bg-red-50 rounded-lg transition-colors inline-flex items-center"
                          title="Delete Student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Student Modal */}
      {(isAddOpen || editingStudent) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-[#E7E5DF] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E7E5DF] bg-[#F8F7F4]/60">
              <h3 className="font-heading text-lg font-bold text-[#142544]">
                {isAddOpen ? 'Add New Student' : 'Edit Student Details'}
              </h3>
              <button
                onClick={() => {
                  setIsAddOpen(false);
                  setEditingStudent(null);
                }}
                className="text-[#647084] hover:text-[#142544] p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={isAddOpen ? handleAddSubmit : handleEditSubmit}
              className="p-6 space-y-4 overflow-y-auto flex-1"
            >
              {errorMsg && (
                <div className="p-3.5 bg-[#FEF2F2] border border-[#FECACA] rounded-xl text-[#991B1B] text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="p-3.5 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl text-[#166534] text-xs flex items-center gap-2">
                  <UserCheck className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#142544] mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={form.first_name}
                    onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] focus:border-[#C58A19] focus:bg-white outline-none"
                    placeholder="Taiwo"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#142544] mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={form.last_name}
                    onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] focus:border-[#C58A19] focus:bg-white outline-none"
                    placeholder="Toyinbo"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#142544] mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] focus:border-[#C58A19] focus:bg-white outline-none"
                  placeholder="student@example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#142544] mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] focus:border-[#C58A19] focus:bg-white outline-none"
                    placeholder="08144326123"
                  />
                </div>
                <div>
                  {isAddOpen ? (
                    <div className="p-2.5 bg-[#F5F0E6] border border-[#C58A19]/30 rounded-xl text-[11px] text-[#C58A19] font-medium space-y-1">
                      <p className="font-bold text-[#142544]">Default Initial Password</p>
                      <p className="text-[#647084]">Set to Surname (<span className="text-[#C58A19] font-bold">{form.last_name || 'Surname'}</span>). Required to change on 1st login.</p>
                    </div>
                  ) : (
                    <>
                      <label className="block text-xs font-semibold text-[#142544] mb-1">Status</label>
                      <select
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                        className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] focus:border-[#C58A19] outline-none"
                      >
                        <option value="active">Active</option>
                        <option value="registered">Registered</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#142544] mb-1">Gender</label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] focus:border-[#C58A19] outline-none"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#142544] mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={form.date_of_birth}
                    onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] focus:border-[#C58A19] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#142544] mb-1">Residential Address</label>
                <textarea
                  rows={2}
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] focus:border-[#C58A19] focus:bg-white outline-none resize-none"
                  placeholder="Lagos, Nigeria"
                />
              </div>

              <div className="pt-4 border-t border-[#E7E5DF] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddOpen(false);
                    setEditingStudent(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-[#647084] hover:text-[#142544]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-[#C58A19] hover:bg-[#A37013] text-white font-semibold rounded-full text-sm shadow-sm flex items-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isAddOpen ? 'Create Student' : 'Save Changes'}</span>
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
            <h3 className="text-lg font-bold text-[#142544] font-heading">Delete Student Account?</h3>
            <p className="text-xs text-[#647084] leading-relaxed">
              Are you sure you want to delete this student account? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 text-sm text-[#647084] hover:text-[#142544]"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-5 py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold rounded-full text-sm shadow-sm"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
