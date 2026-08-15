import type { Metadata } from 'next';
import { AdminTopBar } from '@/components/admin/top-bar';
import { getAllNotifications } from '@/lib/queries/admin';
import { NotificationsClient } from './notifications-client';

export const metadata: Metadata = {
  title: 'Notifications & Announcements | Admin',
};

export default async function NotificationsPage() {
  const notifications = await getAllNotifications();

  return (
    <div className="space-y-6">
      <AdminTopBar title="Notifications & Announcements" />
      <NotificationsClient notifications={notifications} />
    </div>
  );
}
