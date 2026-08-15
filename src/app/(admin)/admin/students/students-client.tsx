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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-navy-900/80 border border-navy-800 p-4 rounded-2xl">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-navy-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-navy-950/80 border border-navy-700/60 rounded-xl text-sm text-white placeholder:text-navy-400 focus:border-brand-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-navy-950/80 border border-navy-700/60 rounded-xl text-sm text-white focus:border-brand-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="registered">Registered</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-400 text-white font-bold rounded-xl text-sm transition-all shadow-glow cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Student List Data Table */}
      <div className="bg-navy-900/80 border border-navy-800 rounded-2xl overflow-hidden shadow-xl">
        {filtered.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <UserCheck className="w-12 h-12 text-navy-400 mx-auto opacity-50" />
            <p className="text-lg font-semibold text-white">No students found</p>
            <p className="text-navy-300 text-sm max-w-xs mx-auto">
              {search ? 'Try adjusting your search filter.' : 'Click "Add New Student" above to register your first student.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-navy-950/80 text-xs font-semibold uppercase tracking-wider text-navy-300 border-b border-navy-800">
                <tr>
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date Joined</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800/60 text-sm">
                {filtered.map((s) => {
                  const p = s.profile || {};
                  return (
                    <tr key={s.id} className="hover:bg-navy-800/40 transition-colors">
                      <td className="px-6 py-4 font-semibold text-white">
                        {p.first_name} {p.last_name}
                      </td>
                      <td className="px-6 py-4 text-navy-200">{p.email}</td>
                      <td className="px-6 py-4 text-navy-200">{p.phone || '-'}</td>
                      <td className="px-6 py-4">
                        <Badge variant={s.status === 'active' ? 'default' : 'info'}>
                          {s.status || 'Active'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-navy-300">{formatDate(s.created_at)}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(s)}
                          className="p-2 text-navy-300 hover:text-white hover:bg-navy-700/60 rounded-lg transition-colors inline-flex items-center"
                          title="Edit Student"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(s.id)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors inline-flex items-center"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-navy-900 border border-navy-700/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-navy-800 bg-navy-950/60">
              <h3 className="font-heading text-lg font-bold text-white">
                {isAddOpen ? 'Add New Student' : 'Edit Student Details'}
              </h3>
              <button
                onClick={() => {
                  setIsAddOpen(false);
                  setEditingStudent(null);
                }}
                className="text-navy-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={isAddOpen ? handleAddSubmit : handleEditSubmit}
              className="p-6 space-y-4 overflow-y-auto flex-1"
            >
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
                  <input
                    type="text"
                    required
                    value={form.first_name}
                    onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                    className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500"
                    placeholder="Taiwo"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-200 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={form.last_name}
                    onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                    className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500"
                    placeholder="Toyinbo"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-200 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500"
                  placeholder="student@example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-200 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500"
                    placeholder="08144326123"
                  />
                </div>
                <div>
                  {isAddOpen ? (
                    <div className="p-2.5 bg-navy-950/80 border border-brand-500/30 rounded-xl text-[11px] text-brand-400 font-semibold space-y-1">
                      <p className="font-bold text-white">Default Initial Password</p>
                      <p className="text-navy-300">Set to Surname (<span className="text-amber-400">{form.last_name || 'Surname'}</span>). Required to change on 1st login.</p>
                    </div>
                  ) : (
                    <>
                      <label className="block text-xs font-semibold text-navy-200 mb-1">Status</label>
                      <select
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                        className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500"
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
                  <label className="block text-xs font-semibold text-navy-200 mb-1">Gender</label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-200 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={form.date_of_birth}
                    onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
                    className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-200 mb-1">Residential Address</label>
                <textarea
                  rows={2}
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500 resize-none"
                  placeholder="Lagos, Nigeria"
                />
              </div>

              <div className="pt-4 border-t border-navy-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddOpen(false);
                    setEditingStudent(null);
                  }}
                  className="px-4 py-2 text-sm font-semibold text-navy-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-brand-500 hover:bg-brand-400 text-white font-bold rounded-xl text-sm shadow-glow flex items-center gap-2"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-navy-900 border border-navy-800 rounded-2xl w-full max-w-sm p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-500/15 text-red-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-heading">Delete Student Account?</h3>
            <p className="text-xs text-navy-300 leading-relaxed">
              Are you sure you want to delete this student account? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 text-sm text-navy-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-sm shadow-md"
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
