import type { Metadata } from 'next';
import { AdminTopBar } from '@/components/admin/top-bar';
import { getAllEnrollments } from '@/lib/queries/admin';
import { EnrollmentsClient } from './enrollments-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Enrollments Management | Admin',
};

export default async function EnrollmentsPage() {
  const enrollments = await getAllEnrollments();

  return (
    <div className="space-y-6">
      <AdminTopBar title="Enrollments Management" />
      <EnrollmentsClient enrollments={enrollments} />
    </div>
  );
}
