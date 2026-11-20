'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, CheckCircle2, AlertCircle, Building, CreditCard, Mail, Phone, MapPin } from 'lucide-react';
import { updateWebsiteSettingsAction } from '@/lib/actions/admin-actions';

interface SettingsProps {
  id?: string;
  academy_name?: string;
  academy_short_name?: string;
  tagline?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  bank_name?: string;
  bank_account_name?: string;
  bank_account_number?: string;
}

export function SettingsClient({ settings }: { settings: SettingsProps | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [form, setForm] = useState({
    academy_name: settings?.academy_name || 'Triumphant Harmony Brass',
    academy_short_name: settings?.academy_short_name || 'THB Academy',
    tagline: settings?.tagline || 'The sound of victory, The heart of harmony.',
    phone: settings?.phone || '08144326123',
    whatsapp: settings?.whatsapp || '08144326123',
    email: settings?.email || 'francisbamirin45@gmail.com',
    address: settings?.address || 'Lagos, Nigeria',
    bank_name: settings?.bank_name || 'First Bank of Nigeria',
    bank_account_name: settings?.bank_account_name || 'Triumphant Harmony Brass',
    bank_account_number: settings?.bank_account_number || '2041261358',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const res = await updateWebsiteSettingsAction(form);
    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Failed to save settings.');
    } else {
      setSuccessMsg(res.message || 'Settings updated successfully.');
      setTimeout(() => {
        setSuccessMsg('');
        router.refresh();
      }, 2000);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {errorMsg && (
        <div className="p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-2xl text-[#991B1B] text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 text-[#DC2626]" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-4 bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl text-[#166534] text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-[#23845B]" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 1. General Academy Details */}
      <div className="bg-white border border-[#E7E5DF] p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
        <div className="flex items-center gap-3 pb-4 border-b border-[#E7E5DF]">
          <div className="w-10 h-10 rounded-xl bg-[#F5F0E6] border border-[#C58A19]/30 text-[#C58A19] flex items-center justify-center">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-heading text-[#142544]">General Academy Branding</h3>
            <p className="text-xs text-[#647084]">Basic contact & profile information displayed on public pages.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-[#142544] mb-1.5">Academy Full Name *</label>
            <input
              type="text"
              required
              value={form.academy_name}
              onChange={(e) => setForm({ ...form, academy_name: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] focus:border-[#C58A19] focus:bg-white outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#142544] mb-1.5">Short Name / Abbreviation</label>
            <input
              type="text"
              value={form.academy_short_name}
              onChange={(e) => setForm({ ...form, academy_short_name: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] focus:border-[#C58A19] focus:bg-white outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#142544] mb-1.5">Tagline / Motto</label>
          <input
            type="text"
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            className="w-full px-4 py-2.5 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] focus:border-[#C58A19] focus:bg-white outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-semibold text-[#142544] mb-1.5">Primary Phone</label>
            <div className="relative">
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full pl-9 pr-4 py-2.5 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] focus:border-[#C58A19] focus:bg-white outline-none"
              />
              <Phone className="w-4 h-4 text-[#8896AB] absolute left-3 top-3" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#142544] mb-1.5">WhatsApp Contact</label>
            <div className="relative">
              <input
                type="text"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                className="w-full pl-9 pr-4 py-2.5 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] focus:border-[#C58A19] focus:bg-white outline-none"
              />
              <Phone className="w-4 h-4 text-[#23845B] absolute left-3 top-3" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#142544] mb-1.5">Official Email</label>
            <div className="relative">
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full pl-9 pr-4 py-2.5 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] focus:border-[#C58A19] focus:bg-white outline-none"
              />
              <Mail className="w-4 h-4 text-[#8896AB] absolute left-3 top-3" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#142544] mb-1.5">Physical Campus Address</label>
          <div className="relative">
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full pl-9 pr-4 py-2.5 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] focus:border-[#C58A19] focus:bg-white outline-none"
            />
            <MapPin className="w-4 h-4 text-[#8896AB] absolute left-3 top-3" />
          </div>
        </div>
      </div>

      {/* 2. Bank Payment Instructions */}
      <div className="bg-white border border-[#E7E5DF] p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
        <div className="flex items-center gap-3 pb-4 border-b border-[#E7E5DF]">
          <div className="w-10 h-10 rounded-xl bg-[#F5F0E6] border border-[#C58A19]/30 text-[#C58A19] flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-heading text-[#142544]">Bank Account & Tuition Fee Instructions</h3>
            <p className="text-xs text-[#647084]">Displayed to students during tuition checkout.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-semibold text-[#142544] mb-1.5">Bank Name</label>
            <input
              type="text"
              value={form.bank_name}
              onChange={(e) => setForm({ ...form, bank_name: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] focus:border-[#C58A19] focus:bg-white outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#142544] mb-1.5">Account Number</label>
            <input
              type="text"
              value={form.bank_account_number}
              onChange={(e) => setForm({ ...form, bank_account_number: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] focus:border-[#C58A19] focus:bg-white outline-none font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#142544] mb-1.5">Account Name</label>
            <input
              type="text"
              value={form.bank_account_name}
              onChange={(e) => setForm({ ...form, bank_account_name: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] focus:border-[#C58A19] focus:bg-white outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-[#C58A19] hover:bg-[#A37013] text-white font-semibold rounded-full text-sm shadow-sm flex items-center gap-2 cursor-pointer transition-all"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          <span>Save Settings</span>
        </button>
      </div>
    </form>
  );
}
