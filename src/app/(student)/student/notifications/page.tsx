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
      case 'payment': return <CreditCard className="w-5 h-5 text-[#23845B]" />;
      case 'schedule': return <Calendar className="w-5 h-5 text-[#C58A19]" />;
      default: return <Info className="w-5 h-5 text-[#142544]" />;
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
          <h1 className="text-3xl font-heading font-bold text-[#142544] tracking-tight">Notifications</h1>
          <p className="text-[#647084] mt-1 text-sm">Stay updated on your classes, syllabus milestones, and account status.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E7E5DF] overflow-hidden divide-y divide-[#E7E5DF] shadow-sm">
        {notifications.map((notification: Record<string, any>) => (
          <div 
            key={notification.id} 
            className={`p-5 flex gap-4 transition-colors ${
              !notification.read ? 'bg-[#F8EBCB]/15' : 'hover:bg-[#F8F7F4]'
            }`}
          >
            <div className="mt-1 flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-[#F8F7F4] border border-[#E7E5DF] flex items-center justify-center">
                {getIcon(notification.type)}
              </div>
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-start">
                <h3 className={`text-sm ${!notification.read ? 'font-bold text-[#142544]' : 'font-medium text-[#243653]'}`}>
                  {notification.title}
                </h3>
                <span className="text-xs text-[#8896AB] whitespace-nowrap ml-4">
                  {formatDate(notification.created_at)}
                </span>
              </div>
              <p className="text-xs text-[#647084] leading-relaxed">
                {notification.message}
              </p>
              <div className="pt-2">
                <Badge variant={getBadgeVariant(notification.type)}>
                  {notification.type || 'system'}
                </Badge>
              </div>
            </div>
            {!notification.read && (
              <div className="w-2 h-2 rounded-full bg-[#C58A19] mt-2 flex-shrink-0"></div>
            )}
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="p-16 text-center space-y-3">
            <Bell className="w-12 h-12 text-[#C58A19] mx-auto opacity-40" />
            <h3 className="text-base font-bold text-[#142544] font-heading">All caught up!</h3>
            <p className="text-xs text-[#647084]">You don't have any pending notifications right now.</p>
          </div>
        )}
      </div>
    </div>
  );
}
