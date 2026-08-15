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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-navy-900/80 border border-navy-800 p-4 rounded-2xl">
        <div>
          <h3 className="font-bold text-white font-heading">Academy System Announcements</h3>
          <p className="text-xs text-navy-300">Broadcast important notices directly to student dashboards.</p>
        </div>

        <button
          onClick={() => {
            setForm({ title: '', message: '', type: 'general' });
            setErrorMsg('');
            setSuccessMsg('');
            setIsAddOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-400 text-white font-bold rounded-xl text-sm transition-all shadow-glow cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Announcement</span>
        </button>
      </div>

      <div className="bg-navy-900/80 border border-navy-800 rounded-2xl overflow-hidden shadow-xl">
        {notifications.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Bell className="w-12 h-12 text-navy-400 mx-auto opacity-50" />
            <p className="text-lg font-semibold text-white">No broadcast notifications sent yet</p>
          </div>
        ) : (
          <div className="divide-y divide-navy-800/60">
            {notifications.map((n) => (
              <div key={n.id} className="p-5 hover:bg-navy-800/40 transition-colors flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-base font-heading">{n.title}</h4>
                    <Badge variant="default">{n.type}</Badge>
                  </div>
                  <p className="text-xs text-navy-200 leading-relaxed max-w-3xl">{n.message}</p>
                  <p className="text-[11px] text-navy-400">{formatDate(n.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-navy-900 border border-navy-700/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-navy-800 bg-navy-950/60">
              <h3 className="font-heading text-lg font-bold text-white">Broadcast Announcement</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-navy-400 hover:text-white p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              {errorMsg && (
                <div className="p-3.5 bg-red-500/15 border border-red-500/30 rounded-xl text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="p-3.5 bg-green-500/15 border border-green-500/30 rounded-xl text-green-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-navy-200 mb-1">Announcement Title *</label>
                <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500" placeholder="Important Notice: Rehearsal Rescheduled" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-200 mb-1">Category Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500">
                  <option value="general">General Announcement</option>
                  <option value="schedule_change">Schedule Change</option>
                  <option value="system">System Notification</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-200 mb-1">Message Content *</label>
                <textarea rows={4} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-brand-500 resize-none" placeholder="Enter announcement text for students..." />
              </div>

              <div className="pt-4 border-t border-navy-800 flex justify-end gap-3">
                <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 text-sm text-navy-300 hover:text-white">Cancel</button>
                <button type="submit" disabled={loading} className="px-6 py-2.5 bg-brand-500 hover:bg-brand-400 text-white font-bold rounded-xl text-sm shadow-glow flex items-center gap-2">
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
