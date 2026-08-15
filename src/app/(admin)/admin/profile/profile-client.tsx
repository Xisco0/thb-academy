'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateMyProfileAction } from '@/lib/actions/admin-actions';
import { User, Shield, Mail, Phone, MapPin, Calendar, CheckCircle, AlertCircle, Loader2, Lock, Save } from 'lucide-react';

interface ProfileClientProps {
  profile: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone?: string | null;
    address?: string | null;
    avatar_url?: string | null;
    user_type: string;
    is_active: boolean;
    created_at: string;
    role_name: string;
    role_rank: number;
  };
}

export function ProfileClient({ profile }: ProfileClientProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    first_name: profile.first_name || '',
    last_name: profile.last_name || '',
    phone: profile.phone || '',
    address: profile.address || '',
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    if (form.phone && form.phone.trim()) {
      if (/[a-zA-Z]/.test(form.phone) || form.phone.replace(/\D/g, '').length !== 11) {
        setErrorMsg('Phone number must be exactly 11 digits containing numbers only (e.g. 08144326123).');
        setLoading(false);
        return;
      }
    }

    const res = await updateMyProfileAction(form);
    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Failed to update profile.');
    } else {
      setSuccessMsg(res.message || 'Profile updated successfully!');
      router.refresh();
    }
  }

  const initials = `${(profile.first_name || 'A').charAt(0)}${(profile.last_name || 'D').charAt(0)}`.toUpperCase();
  const joinedDate = new Date(profile.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header Profile Overview Banner */}
      <div className="relative overflow-hidden bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {/* Avatar Initials Badge */}
          <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-tr from-brand-500 via-amber-500 to-yellow-400 p-1 shadow-glow shrink-0">
            <div className="w-full h-full bg-navy-950 rounded-[14px] flex items-center justify-center text-3xl font-black text-brand-400 font-heading">
              {initials}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-navy-900 flex items-center justify-center text-white text-[10px]" title="Account Active">
              ✓
            </div>
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <h2 className="text-2xl font-bold font-heading text-white">
                {profile.first_name} {profile.last_name}
              </h2>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-500/20 border border-brand-500/40 text-brand-400 text-xs font-bold rounded-full">
                <Shield className="w-3.5 h-3.5" />
                {profile.role_name}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-full">
                <CheckCircle className="w-3.5 h-3.5" />
                Active Account
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-y-2 gap-x-6 text-xs text-navy-300 pt-1">
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-brand-400" />
                {profile.email}
              </span>
              {profile.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-brand-400" />
                  {profile.phone}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-navy-400" />
                Member since {joinedDate}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Editable Form & Account Details Card */}
      <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="border-b border-navy-800 pb-4 mb-6">
          <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
            <User className="w-5 h-5 text-brand-400" />
            Edit My Profile Details
          </h3>
          <p className="text-xs text-navy-300 mt-1">
            Update your personal information. Locked fields (Email and Role) can only be modified by system administrators.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-500/15 border border-red-500/30 rounded-2xl text-red-300 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-emerald-300 text-sm flex items-center gap-3">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-navy-200 mb-1">First Name *</label>
              <input
                type="text"
                required
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                className="w-full px-4 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-200 mb-1">Surname / Last Name *</label>
              <input
                type="text"
                required
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                className="w-full px-4 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-navy-200 mb-1">Phone Number (11 digits)</label>
              <input
                type="text"
                maxLength={11}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 11) })}
                placeholder="08144326123"
                className="w-full px-4 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-200 mb-1 flex items-center justify-between">
                <span>Email Address</span>
                <span className="text-[10px] text-navy-400 font-normal flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-400" /> Locked Read-Only
                </span>
              </label>
              <input
                type="email"
                disabled
                value={profile.email}
                className="w-full px-4 py-2.5 bg-navy-950/50 border border-navy-800 rounded-xl text-sm text-navy-400 opacity-70 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-navy-200 mb-1 flex items-center justify-between">
                <span>Assigned Administrative Role</span>
                <span className="text-[10px] text-navy-400 font-normal flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-400" /> Locked Read-Only
                </span>
              </label>
              <input
                type="text"
                disabled
                value={profile.role_name}
                className="w-full px-4 py-2.5 bg-navy-950/50 border border-navy-800 rounded-xl text-sm text-brand-400 font-bold opacity-80 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-200 mb-1 flex items-center justify-between">
                <span>Account Status</span>
                <span className="text-[10px] text-navy-400 font-normal flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-400" /> Locked Read-Only
                </span>
              </label>
              <input
                type="text"
                disabled
                value={profile.is_active ? 'Active' : 'Suspended'}
                className="w-full px-4 py-2.5 bg-navy-950/50 border border-navy-800 rounded-xl text-sm text-emerald-400 font-bold opacity-80 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-200 mb-1">Residential Address</label>
            <textarea
              rows={3}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Enter your current residential address"
              className="w-full px-4 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div className="pt-4 border-t border-navy-800 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-brand-500 to-amber-500 text-navy-950 font-bold text-sm rounded-xl hover:shadow-glow transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
