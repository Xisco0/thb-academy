import { getAllSchedules } from '@/lib/queries/admin';
import { formatDate } from '@/lib/utils';
import { AdminTopBar } from '@/components/admin/top-bar';
import { Badge } from '@/components/ui/badge';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Schedules | Admin'
};

export default async function SchedulesPage() {
  const schedules = await getAllSchedules() as Record<string, any>[];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <AdminTopBar title="Schedules" />
      <div className="bg-navy-800/50 border border-navy-700/30 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-navy-900/50 text-navy-200">
              <tr>
                <th className="px-6 py-4 font-medium">Student</th>
                <th className="px-6 py-4 font-medium">Course</th>
                <th className="px-6 py-4 font-medium">Instructor</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Time</th>
                <th className="px-6 py-4 font-medium">Venue</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700/30 text-white">
              {schedules?.map((schedule) => (
                <tr key={schedule.id} className="hover:bg-navy-800/80 transition-colors">
                  <td className="px-6 py-4">{schedule.enrollment?.student?.profile?.first_name} {schedule.enrollment?.student?.profile?.last_name}</td>
                  <td className="px-6 py-4">{schedule.enrollment?.course?.name}</td>
                  <td className="px-6 py-4">{schedule.instructor?.first_name} {schedule.instructor?.last_name}</td>
                  <td className="px-6 py-4">{formatDate(schedule.date)}</td>
                  <td className="px-6 py-4">{schedule.start_time} - {schedule.end_time}</td>
                  <td className="px-6 py-4">{schedule.venue}</td>
                  <td className="px-6 py-4">
                    <Badge variant="default" className="border-gold-500/50 text-gold-400">
                      {schedule.status}
                    </Badge>
                  </td>
                </tr>
              ))}
              {!schedules?.length && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-navy-300">
                    No schedules found.
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
