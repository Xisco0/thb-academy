import type { Metadata } from 'next';
import { AdminTopBar } from '@/components/admin/top-bar';
import { getAllSchedules, getAllCourses, getAllInstructors, getAllVenues } from '@/lib/queries/admin';
import { SchedulesClient } from './schedules-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Class Schedules | Admin',
};

export default async function SchedulesPage() {
  const [schedules, courses, instructors, venues] = await Promise.all([
    getAllSchedules(),
    getAllCourses(),
    getAllInstructors(),
    getAllVenues(),
  ]);

  return (
    <div className="space-y-6">
      <AdminTopBar title="Class Schedules Management" />
      <SchedulesClient schedules={schedules} courses={courses} instructors={instructors} venues={venues} />
    </div>
  );
}
