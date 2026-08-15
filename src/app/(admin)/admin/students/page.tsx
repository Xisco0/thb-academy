import type { Metadata } from 'next';
import { AdminTopBar } from '@/components/admin/top-bar';
import { getAllStudents } from '@/lib/queries/admin';
import { StudentsClient } from './students-client';

export const metadata: Metadata = {
  title: 'Students Management | Admin',
};

export default async function StudentsPage() {
  const students = await getAllStudents();

  return (
    <div className="space-y-6">
      <AdminTopBar title="Students Management" />
      <StudentsClient students={students} />
    </div>
  );
}
