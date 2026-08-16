'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Plus, Edit2, ShieldCheck, X, Loader2, AlertCircle, Shield, User, Eye, EyeOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import {
  createAdminUserAction,
  toggleAdminStatusAction,
  updateAdminUserAction,
} from '@/lib/actions/admin-actions';
import { getRoleRankByName } from '@/lib/utils/roles';

interface AdminUserProps {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  password?: string;
  is_active: boolean;
  created_at: string;
  role_name?: string;
  role_rank?: number;
  user_roles?: { role_id?: string; role?: { name: string } }[];
}

interface CurrentUserProps {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role_name: string;
  role_rank: number;
}

export function AdminsClient({
  admins,
  roles,
  currentUser,
}: {
  admins: AdminUserProps[];
  roles: { id: string; name: string }[];
  currentUser: CurrentUserProps;
}) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminUserProps | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Filter role options caller is allowed to assign
  const assignableRoles = roles.filter((r) => {
    if (currentUser.role_rank >= 100) return true;
    const rank = getRoleRankByName(r.name);
    return rank <= currentUser.role_rank;
  });

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    role_id: assignableRoles[0]?.id || roles[0]?.id || '',
  });

  // Ensure current user is excluded from management list
  const filtered = admins
    .filter((a) => a.id !== currentUser.id)
    .filter((a) => {
      const fullName = `${a.first_name || ''} ${a.last_name || ''}`.toLowerCase();
      return fullName.includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase());
    });

  function openAddModal() {
    setEditingItem(null);
    setForm({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      address: '',
      password: '',
      role_id: assignableRoles[0]?.id || roles[0]?.id || '',
    });
    setErrorMsg('');
    setSuccessMsg('');
    setIsAddOpen(true);
  }

  function openEditModal(item: AdminUserProps) {
    setEditingItem(item);
    const existingRoleId = item.user_roles?.[0]?.role_id || assignableRoles[0]?.id || '';
    const defaultPassword = item.password || `${(item.last_name || '').toLowerCase().trim()}thb`;
    setForm({
      first_name: item.first_name || '',
      last_name: item.last_name || '',
      email: item.email || '',
      phone: item.phone || '',
      address: item.address || '',
      password: defaultPassword,
      role_id: existingRoleId,
    });
    setErrorMsg('');
    setSuccessMsg('');
    setIsAddOpen(false);
  }

  async function handleToggleStatus(id: string, newStatus: boolean) {
    setActionLoadingId(id);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await toggleAdminStatusAction(id, newStatus);
      if (res.success) {
        setSuccessMsg(res.message || 'Action completed successfully.');
        router.refresh();
      } else {
        setErrorMsg(res.error || 'Failed to update admin status.');
      }
    } catch {
      setErrorMsg('Error performing admin status update.');
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (editingItem) {
        const res = await updateAdminUserAction(editingItem.id, form);
        if (res.success) {
          setSuccessMsg(res.message || 'Admin updated successfully.');
          setEditingItem(null);
          router.refresh();
        } else {
          setErrorMsg(res.error || 'Failed to update admin.');
        }
      } else {
        const res = await createAdminUserAction(form);
        if (res.success) {
          setSuccessMsg(res.message || 'Admin created successfully');
          setIsAddOpen(false);
          router.refresh();
        } else {
          setErrorMsg(res.error || 'Failed to create admin.');
        }
      }
    } catch {
      setErrorMsg('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Role Context Bar */}
      <div className="bg-navy-900/90 border border-navy-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-sm">Your Account: {currentUser.first_name} {currentUser.last_name}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {currentUser.role_name}
              </span>
            </div>
            <p className="text-xs text-navy-300 mt-0.5">
              Email: <span className="text-white font-mono">{currentUser.email}</span>
            </p>
          </div>
        </div>

        <Link
          href="/admin/profile"
          className="px-4 py-2 bg-navy-950 hover:bg-navy-800 border border-navy-700 text-brand-300 rounded-xl text-xs font-bold transition-colors"
        >
          <span>My Profile</span>
        </Link>
      </div>

      {/* Global Messages */}
      {errorMsg && !isAddOpen && !editingItem && (
        <div className="p-4 bg-red-500/15 border border-red-500/30 rounded-2xl text-red-300 text-sm flex items-center gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && !isAddOpen && !editingItem && (
        <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-emerald-300 text-sm flex items-center gap-3 animate-fade-in">
          <ShieldCheck className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Search Bar & Add Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-navy-900/80 border border-navy-800 p-4 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-navy-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search authorized staff and administrators..."
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
          <span>Add Admin User</span>
        </button>
      </div>

      {/* Admins Table */}
      <div className="bg-navy-900/80 border border-navy-800 rounded-2xl overflow-hidden shadow-xl">
        {filtered.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <ShieldCheck className="w-12 h-12 text-navy-400 mx-auto opacity-50" />
            <p className="text-lg font-semibold text-white">No subordinate admin accounts in your management scope</p>
            <p className="text-xs text-navy-400">Higher-level admins and your own account are excluded according to role hierarchy rules.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-navy-950/80 text-xs font-semibold uppercase tracking-wider text-navy-300 border-b border-navy-800">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Assigned Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800/60 text-sm">
                {filtered.map((a) => {
                  const roleName = a.role_name || a.user_roles?.[0]?.role?.name || 'Admin';
                  const targetRank = a.role_rank || getRoleRankByName(roleName);
                  const canManage = currentUser.role_rank >= 100 || targetRank < currentUser.role_rank;

                  return (
                    <tr key={a.id} className="hover:bg-navy-800/40 transition-colors">
                      <td className="px-6 py-4 font-semibold text-white">{a.first_name} {a.last_name}</td>
                      <td className="px-6 py-4 text-navy-200">{a.email}</td>
                      <td className="px-6 py-4 text-navy-200">{a.phone || '-'}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-amber-400 font-bold text-xs uppercase tracking-wider">
                          <Shield className="w-3 h-3" />
                          {roleName}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={a.is_active ? 'default' : 'info'}>{a.is_active ? 'Active' : 'Suspended'}</Badge>
                      </td>
                      <td className="px-6 py-4 text-navy-300">{formatDate(a.created_at)}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {canManage ? (
                          <>
                            <button
                              onClick={() => openEditModal(a)}
                              className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5 bg-navy-800 text-brand-300 border border-navy-700 hover:bg-navy-700 hover:text-white cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleToggleStatus(a.id, !a.is_active)}
                              disabled={actionLoadingId === a.id}
                              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer ${
                                a.is_active
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                                  : 'bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30'
                              }`}
                            >
                              {actionLoadingId === a.id && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                              <span>{a.is_active ? 'Suspend' : 'Activate'}</span>
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-navy-400 italic">View Only (Protected)</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Admin Modal */}
      {(isAddOpen || editingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-navy-900 border border-navy-700/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-navy-800 bg-navy-950/60">
              <h3 className="font-heading text-lg font-bold text-white">
                {editingItem ? `Edit Admin Profile — ${editingItem.first_name} ${editingItem.last_name}` : 'Create Admin Account'}
              </h3>
              <button
                onClick={() => {
                  setIsAddOpen(false);
                  setEditingItem(null);
                }}
                className="p-1.5 text-navy-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4 overflow-y-auto flex-1">
              {errorMsg && (
                <div className="p-3.5 bg-red-500/15 border border-red-500/30 rounded-xl text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-navy-200">First Name *</label>
                  <input
                    type="text"
                    required
                    value={form.first_name}
                    onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500"
                    placeholder="Francis"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-navy-200">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={form.last_name}
                    onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500"
                    placeholder="Bamirin"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-navy-200">Email Address *</label>
                <input
                  type="email"
                  required
                  disabled={!!editingItem}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3.5 py-2 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500 disabled:opacity-60"
                  placeholder="admin@thbacademy.org"
                />
              </div>

              {/* Password View & Edit Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-navy-200">
                    {editingItem ? 'Account Password' : 'Password (Default: surname + thb)'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showPassword ? 'Hide' : 'Show Password'}</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full px-3.5 py-2 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500 font-mono tracking-wider"
                    placeholder={editingItem ? 'Enter new password or keep existing' : 'e.g. bamirinthb'}
                  />
                </div>
                <p className="text-[11px] text-navy-400">
                  {editingItem ? 'You can view or update this admin person’s login password directly.' : 'Default password format is surname + thb (e.g. bamirinthb).'}
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-navy-200">Phone Number (11 digits)</label>
                <input
                  type="text"
                  maxLength={11}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3.5 py-2 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500 font-mono"
                  placeholder="08144326123"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-navy-200">Assign Administrative Role *</label>
                <select
                  value={form.role_id}
                  onChange={(e) => setForm({ ...form, role_id: e.target.value })}
                  className="w-full px-3.5 py-2 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500"
                >
                  {assignableRoles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 border-t border-navy-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddOpen(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 bg-navy-950 text-navy-300 hover:text-white rounded-xl text-xs font-bold border border-navy-700 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-brand-500 hover:bg-brand-400 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-glow flex items-center gap-2 cursor-pointer"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingItem ? 'Save Changes' : 'Create Admin Account'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
