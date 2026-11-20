'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Plus, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { createNotificationAction } from '@/lib/actions/admin-actions';

interface NotificationProps {
  id: string;
  title: string;
  message: string;
  type: string;
  created_at: string;
}

export function NotificationsClient({ notifications }: { notifications: NotificationProps[] }) {
  const router = useRouter();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [form, setForm] = useState({
    title: '',
    message: '',
    type: 'general',
  });

  async function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const res = await createNotificationAction(form);
    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Failed to send notification.');
    } else {
      setSuccessMsg(res.message || 'Notification broadcasted!');
      setTimeout(() => {
        setIsAddOpen(false);
        router.refresh();
      }, 1200);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white border border-[#E7E5DF] p-4 rounded-2xl shadow-sm">
        <div>
          <h3 className="font-bold text-[#142544] font-heading text-base">Academy System Announcements</h3>
          <p className="text-xs text-[#647084]">Broadcast important notices directly to student dashboards.</p>
        </div>

        <button
          onClick={() => {
            setForm({ title: '', message: '', type: 'general' });
            setErrorMsg('');
            setSuccessMsg('');
            setIsAddOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#C58A19] hover:bg-[#A37013] text-white font-semibold rounded-full text-sm transition-all shadow-sm cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Announcement</span>
        </button>
      </div>

      <div className="bg-white border border-[#E7E5DF] rounded-2xl overflow-hidden shadow-sm">
        {notifications.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Bell className="w-12 h-12 text-[#C58A19] mx-auto opacity-40" />
            <p className="text-base font-bold text-[#142544] font-heading">No broadcast notifications sent yet</p>
          </div>
        ) : (
          <div className="divide-y divide-[#E7E5DF]">
            {notifications.map((n) => (
              <div key={n.id} className="p-5 hover:bg-[#F8F7F4]/60 transition-colors flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-[#142544] text-base font-heading">{n.title}</h4>
                    <Badge variant="default">{n.type}</Badge>
                  </div>
                  <p className="text-xs text-[#647084] leading-relaxed max-w-3xl">{n.message}</p>
                  <p className="text-[11px] text-[#8896AB]">{formatDate(n.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-[#E7E5DF] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E7E5DF] bg-[#F8F7F4]/60">
              <h3 className="font-heading text-lg font-bold text-[#142544]">Broadcast Announcement</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-[#647084] hover:text-[#142544] p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
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
                <label className="block text-xs font-semibold text-[#142544] mb-1">Announcement Title *</label>
                <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3.5 py-2 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] focus:border-[#C58A19] focus:bg-white outline-none" placeholder="Important Notice: Rehearsal Rescheduled" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#142544] mb-1">Category Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3.5 py-2 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] focus:border-[#C58A19] outline-none">
                  <option value="general">General Announcement</option>
                  <option value="schedule_change">Schedule Change</option>
                  <option value="system">System Notification</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#142544] mb-1">Message Content *</label>
                <textarea rows={4} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-3.5 py-2 bg-[#F8F7F4] border border-[#E7E5DF] rounded-xl text-sm text-[#142544] focus:border-[#C58A19] focus:bg-white outline-none resize-none" placeholder="Enter announcement text for students..." />
              </div>

              <div className="pt-4 border-t border-[#E7E5DF] flex justify-end gap-3">
                <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 text-sm text-[#647084] hover:text-[#142544]">Cancel</button>
                <button type="submit" disabled={loading} className="px-6 py-2.5 bg-[#C58A19] hover:bg-[#A37013] text-white font-semibold rounded-full text-sm shadow-sm flex items-center gap-2">
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Broadcast Announcement</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
