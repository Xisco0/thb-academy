import type { Metadata } from 'next';
import { AdminTopBar } from '@/components/admin/top-bar';
import { getAllPayments } from '@/lib/queries/admin';
import { PaymentsClient } from './payments-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Payments Verification | Admin',
};

export default async function PaymentsPage() {
  const payments = await getAllPayments();

  return (
    <div className="space-y-6">
      <AdminTopBar title="Payments Verification & Approvals" />
      <PaymentsClient payments={payments} />
    </div>
  );
}
