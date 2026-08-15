import type { Metadata } from 'next';
import { AdminTopBar } from '@/components/admin/top-bar';
import { getAllInstructors } from '@/lib/queries/admin';
import { InstructorsClient } from './instructors-client';

export const metadata: Metadata = {
  title: 'Instructors Management | Admin',
};

export default async function InstructorsPage() {
  const instructors = await getAllInstructors();

  return (
    <div className="space-y-6">
      <AdminTopBar title="Instructors Management" />
      <InstructorsClient instructors={instructors} />
    </div>
  );
}
