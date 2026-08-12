import { getAllNotifications } from '@/lib/queries/admin';
import { formatDate } from '@/lib/utils';
import { AdminTopBar } from '@/components/admin/top-bar';
import { Badge } from '@/components/ui/badge';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notifications | Admin'
};

export default async function NotificationsPage() {
  const notifications = await getAllNotifications() as Record<string, any>[];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <AdminTopBar title="Notifications" />
      <div className="bg-navy-800/50 border border-navy-700/30 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-navy-900/50 text-navy-200">
              <tr>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Message</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700/30 text-white">
              {notifications?.map((notification) => (
                <tr key={notification.id} className="hover:bg-navy-800/80 transition-colors">
                  <td className="px-6 py-4 font-medium">{notification.title}</td>
                  <td className="px-6 py-4 text-navy-300">
                    {notification.message?.length > 60 
                      ? `${notification.message.substring(0, 60)}...` 
                      : notification.message}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="default" className="border-gold-500/50 text-gold-400">
                      {notification.type}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-navy-300">{formatDate(notification.created_at)}</td>
                </tr>
              ))}
              {!notifications?.length && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-navy-300">
                    No notifications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
