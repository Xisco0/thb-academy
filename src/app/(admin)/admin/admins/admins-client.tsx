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
      <div className="bg-white border border-[#E7E5DF] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F5F0E6] border border-[#C58A19]/30 flex items-center justify-center text-[#C58A19] shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[#142544] font-bold text-sm">Your Account: {currentUser.first_name} {currentUser.last_name}</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F5F0E6] text-[#C58A19] border border-[#C58A19]/30">
                {currentUser.role_name}
              </span>
            </div>
            <p className="text-xs text-[#647084] mt-0.5">
              Email: <span className="text-[#142544] font-medium">{currentUser.email}</span>
            </p>
          </div>
        </div>

        <Link
          href="/admin/profile"
          className="px-4 py-2 bg-[#F8F7F4] hover:bg-[#F5F0E6] border border-[#E7E5DF] text-[#142544] rounded-full text-xs font-semibold transition-colors shadow-xs"
        >
          <span>My Profile</span>
        </Link>
      </div>

      {/* Global Messages */}
      {errorMsg && !isAddOpen && !editingItem && (
        <div className="p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-2xl text-[#991B1B] text-sm flex items-center gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 text-[#DC2626]" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && !isAddOpen && !editingItem && (
        <div className="p-4 bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl text-[#166534] text-sm flex items-center gap-3 animate-fade-in">
          <ShieldCheck className="w-5 h-5 shrink-0 text-[#23845B]" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Search Bar & Add Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white border border-[#E7E5DF] p-4 rounded-2xl shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8896AB] absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search authorized staff and administrators..."
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
          <span>Add Admin User</span>
        </button>
      </div>

      {/* Admins Table */}
      <div className="bg-white border border-[#E7E5DF] rounded-2xl overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <ShieldCheck className="w-12 h-12 text-[#C58A19] mx-auto opacity-40" />
            <p className="text-base font-bold text-[#142544] font-heading">No subordinate admin accounts in your management scope</p>
            <p className="text-xs text-[#647084]">Higher-level admins and your own account are excluded according to role hierarchy rules.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F8F7F4] text-xs font-semibold uppercase tracking-wider text-[#647084] border-b border-[#E7E5DF]">
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
              <tbody className="divide-y divide-[#E7E5DF] text-sm">
                {filtered.map((a) => {
                  const roleName = a.role_name || a.user_roles?.[0]?.role?.name || 'Admin';
                  const targetRank = a.role_rank || getRoleRankByName(roleName);
                  const canManage = currentUser.role_rank >= 100 || targetRank < currentUser.role_rank;

                  return (
                    <tr key={a.id} className="hover:bg-[#F8F7F4]/60 transition-colors">
                      <td className="px-6 py-4 font-semibold text-[#142544]">{a.first_name} {a.last_name}</td>
                      <td className="px-6 py-4 text-[#647084]">{a.email}</td>
                      <td className="px-6 py-4 text-[#647084]">{a.phone || '-'}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-[#C58A19] font-semibold text-xs uppercase tracking-wider">
                          <Shield className="w-3 h-3" />
                          {roleName}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={a.is_active ? 'default' : 'info'}>{a.is_active ? 'Active' : 'Suspended'}</Badge>
                      </td>
                      <td className="px-6 py-4 text-[#8896AB] text-xs">{formatDate(a.created_at)}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {canManage ? (
                          <>
                            <button
                              onClick={() => openEditModal(a)}
                              className="px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors inline-flex items-center gap-1.5 bg-[#F8F7F4] text-[#142544] border border-[#E7E5DF] hover:bg-[#F5F0E6] cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleToggleStatus(a.id, !a.is_active)}
                              disabled={actionLoadingId === a.id}
                              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors inline-flex items-center gap-1.5 cursor-pointer ${
                                a.is_active
                                  ? 'bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA] hover:bg-red-100'
                                  : 'bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0] hover:bg-emerald-100'
                              }`}
                            >
                              {actionLoadingId === a.id && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                              <span>{a.is_active ? 'Suspend' : 'Activate'}</span>
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-[#8896AB] italic">View Only (Protected)</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-[#E7E5DF] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E7E5DF] bg-[#F8F7F4]/60">
              <h3 className="font-heading text-lg font-bold text-[#142544]">
                {editingItem ? `Edit Admin Profile — ${editingItem.first_name} ${editingItem.last_name}` : 'Create Admin Account'}
              </h3>
              <button
                onClick={() => {
                  setIsAddOpen(false);
                  setEditingItem(null);
                }}
                className="p-1.5 text-[#647084] hover:text-[#142544] rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4 overflow-y-auto flex-1">
              {errorMsg && (
                <div className="p-3.5 bg-[#FEF2F2] border border-[#FECACA] rounded-xl text-[#991B1B] text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#DC2626]" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#142544]">First Name *</label>
                  <input
                    type="text"
                    required
                    value={form.first_name}
                    onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] focus:border-[#C58A19] focus:bg-white outline-none"
                    placeholder="Francis"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#142544]">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={form.last_name}
                    onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] focus:border-[#C58A19] focus:bg-white outline-none"
                    placeholder="Bamirin"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#142544]">Email Address *</label>
                <input
                  type="email"
                  required
                  disabled={!!editingItem}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] focus:border-[#C58A19] focus:bg-white outline-none disabled:opacity-60"
                  placeholder="admin@thbacademy.org"
                />
              </div>

              {/* Password View & Edit Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#142544]">
                    {editingItem ? 'Account Password' : 'Password (Default: surname + thb)'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-[#C58A19] hover:text-[#A37013] font-semibold flex items-center gap-1 cursor-pointer"
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
                    className="w-full px-3.5 py-2 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] focus:border-[#C58A19] focus:bg-white outline-none font-mono"
                    placeholder={editingItem ? 'Enter new password or keep existing' : 'e.g. bamirinthb'}
                  />
                </div>
                <p className="text-[11px] text-[#8896AB]">
                  {editingItem ? 'You can view or update this administrator’s login password directly.' : 'Default password format is surname + thb (e.g. bamirinthb).'}
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#142544]">Phone Number (11 digits)</label>
                <input
                  type="text"
                  maxLength={11}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] focus:border-[#C58A19] focus:bg-white outline-none font-mono"
                  placeholder="08144326123"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#142544]">Assign Administrative Role *</label>
                <select
                  value={form.role_id}
                  onChange={(e) => setForm({ ...form, role_id: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] focus:border-[#C58A19] outline-none"
                >
                  {assignableRoles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 border-t border-[#E7E5DF] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddOpen(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 bg-[#F8F7F4] text-[#647084] hover:text-[#142544] rounded-full text-xs font-semibold border border-[#E7E5DF] cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-[#C58A19] hover:bg-[#A37013] text-white font-semibold rounded-full text-xs uppercase tracking-wider transition-all shadow-sm flex items-center gap-2 cursor-pointer"
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
