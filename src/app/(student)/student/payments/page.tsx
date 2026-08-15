import { getUser } from '@/lib/auth/session';
import { getStudentProfile, getStudentPayments } from '@/lib/queries/student';
import { StudentPaymentsClient } from './student-payments-client';

export const metadata = {
  title: 'My Payments | Student Portal',
};

export default async function PaymentsPage() {
  const user = await getUser();
  const profile = await getStudentProfile(user?.id || '');
  const rawPayments = profile ? await getStudentPayments(profile.id) : [];

  const formattedPayments = rawPayments.map((p: any) => ({
    id: p.id,
    amount: Number(p.amount) || 0,
    currency: p.currency || 'NGN',
    payment_method: p.payment_method || 'bank_transfer',
    status: p.status || 'pending',
    rejection_reason: p.rejection_reason || undefined,
    proof_url: p.proof_url || undefined,
    transaction_reference: p.transaction_reference || undefined,
    created_at: p.created_at,
    enrollment: p.enrollment
      ? {
          course: p.enrollment.course
            ? {
                name: p.enrollment.course.name,
                price: Number(p.enrollment.course.price) || 0,
                currency: p.enrollment.course.currency || 'NGN',
              }
            : undefined,
        }
      : undefined,
  }));

  return <StudentPaymentsClient payments={formattedPayments} />;
}
