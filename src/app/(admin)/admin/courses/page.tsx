import type { Metadata } from 'next';
import { AdminTopBar } from '@/components/admin/top-bar';
import { getAllCourses, getAllInstruments, getAllInstructors } from '@/lib/queries/admin';
import { CoursesClient } from './courses-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Courses Management | Admin',
};

export default async function CoursesPage() {
  const [courses, instruments, instructors] = await Promise.all([
    getAllCourses(),
    getAllInstruments(),
    getAllInstructors(),
  ]);

  return (
    <div className="space-y-6">
      <AdminTopBar title="Courses Management" />
      <CoursesClient courses={courses} instruments={instruments} instructors={instructors} />
    </div>
  );
}
