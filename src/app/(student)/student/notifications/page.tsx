import { getUser } from '@/lib/auth/session';
import { getStudentNotifications } from '@/lib/queries/student';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Bell, Calendar, CreditCard, Info } from 'lucide-react';

export const metadata = {
  title: 'Notifications | Student Portal'
};

export default async function NotificationsPage() {
  const user = await getUser();
  const notifications = user ? await getStudentNotifications(user.id) : [];

  const getIcon = (type: string) => {
    switch(type) {
      case 'payment': return <CreditCard className="w-5 h-5 text-success-400" />;
      case 'schedule': return <Calendar className="w-5 h-5 text-warning-400" />;
      default: return <Info className="w-5 h-5 text-brand-400" />;
    }
  };

  const getBadgeVariant = (type: string) => {
    switch(type) {
      case 'payment': return 'success';
      case 'schedule': return 'warning';
      default: return 'info';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Notifications</h1>
          <p className="text-slate-400 mt-1">Stay updated on your classes and account status.</p>
        </div>
        <button className="text-sm text-brand-400 hover:text-brand-300 font-medium">
          Mark all as read
        </button>
      </div>

      <div className="bg-navy-800/80 rounded-xl border border-navy-700/50 overflow-hidden divide-y divide-navy-700/50">
        {notifications.map((notification: Record<string, any>) => (
          <div 
            key={notification.id} 
            className={`p-5 flex gap-4 transition-colors ${
              !notification.read ? 'bg-navy-700/20' : 'hover:bg-navy-700/10'
            }`}
          >
            <div className="mt-1 flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-navy-900 border border-navy-700 flex items-center justify-center">
                {getIcon(notification.type)}
              </div>
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-start">
                <h3 className={`text-base ${!notification.read ? 'font-semibold text-white' : 'font-medium text-slate-200'}`}>
                  {notification.title}
                </h3>
                <span className="text-xs text-slate-400 whitespace-nowrap ml-4">
                  {formatDate(notification.created_at)}
                </span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                {notification.message}
              </p>
              <div className="pt-2">
                <Badge variant={getBadgeVariant(notification.type)}>
                  {notification.type || 'system'}
                </Badge>
              </div>
            </div>
            {!notification.read && (
              <div className="w-2 h-2 rounded-full bg-brand-500 mt-2 flex-shrink-0"></div>
            )}
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="p-12 text-center">
            <Bell className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-1">All caught up!</h3>
            <p className="text-slate-400">You don't have any notifications at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
