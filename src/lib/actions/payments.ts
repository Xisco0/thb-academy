'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import {
  sendPaymentSubmittedEmail,
  sendPaymentApprovedEmail,
  sendPaymentRejectedEmail,
} from '@/lib/email';

export async function submitPayment(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const enrollmentId = formData.get('enrollment_id') as string;
  const amount = Number(formData.get('amount'));
  const paymentMethod = (formData.get('payment_method') as string) || 'bank_transfer';
  const transactionReference = formData.get('transaction_reference') as string;
  const proofFile = formData.get('proof') as File | null;

  // Get student & profile
  const { data: student } = await supabase
    .from('students')
    .select('id, profile:profiles(first_name, last_name, email)')
    .eq('profile_id', user.id)
    .single();
  if (!student) throw new Error('Student not found');

  let proofUrl: string | null = null;

  // Upload proof file to Supabase Storage
  if (proofFile && proofFile.size > 0) {
    const ext = proofFile.name.split('.').pop();
    const fileName = `${student.id}/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from('payment-proofs')
      .upload(fileName, proofFile);
    if (uploadError) throw new Error('Failed to upload proof');
    const { data: urlData } = supabase.storage.from('payment-proofs').getPublicUrl(fileName);
    proofUrl = urlData.publicUrl;
  }

  const { error } = await supabase.from('payments').insert({
    student_id: student.id,
    enrollment_id: enrollmentId,
    amount,
    currency: 'NGN',
    payment_method: paymentMethod,
    transaction_reference: transactionReference || null,
    proof_url: proofUrl,
    status: 'pending',
    submitted_at: new Date().toISOString(),
  });

  if (error) throw new Error(error.message);

  // Send Email Notification
  const profile = (student as any)?.profile;
  if (profile?.email) {
    // Get course name
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('course:courses(name)')
      .eq('id', enrollmentId)
      .single();
    const courseName = (enrollment as any)?.course?.name || 'Music Course';

    sendPaymentSubmittedEmail({
      email: profile.email,
      name: `${profile.first_name || 'Student'}`,
      courseName,
      amount,
    }).catch(() => {}); // Non-blocking async
  }

  revalidatePath('/student/payments');
  revalidatePath('/admin/payments');
  return { success: true };
}

export async function approvePayment(paymentId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Get the payment with student and course
  const { data: payment } = await supabase
    .from('payments')
    .select(`
      enrollment_id,
      student:students(profile:profiles(first_name, email)),
      enrollment:enrollments(course:courses(name))
    `)
    .eq('id', paymentId)
    .single();
  if (!payment) throw new Error('Payment not found');

  // Update payment status
  const { error: paymentError } = await supabase
    .from('payments')
    .update({
      status: 'approved',
      verified_at: new Date().toISOString(),
      verified_by: user.id,
    })
    .eq('id', paymentId);
  if (paymentError) throw new Error(paymentError.message);

  // Activate enrollment
  const { error: enrollError } = await supabase
    .from('enrollments')
    .update({
      status: 'active',
      activation_date: new Date().toISOString(),
    })
    .eq('id', payment.enrollment_id);
  if (enrollError) throw new Error(enrollError.message);

  // Send Email Notification
  const profile = (payment as any)?.student?.profile;
  const courseName = (payment as any)?.enrollment?.course?.name || 'Music Course';
  if (profile?.email) {
    sendPaymentApprovedEmail({
      email: profile.email,
      name: profile.first_name || 'Student',
      courseName,
    }).catch(() => {});
  }

  revalidatePath('/admin/payments');
  revalidatePath('/admin/enrollments');
  return { success: true };
}

export async function rejectPayment(paymentId: string, reason: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Get the payment with student and course
  const { data: payment } = await supabase
    .from('payments')
    .select(`
      student:students(profile:profiles(first_name, email)),
      enrollment:enrollments(course:courses(name))
    `)
    .eq('id', paymentId)
    .single();

  const { error } = await supabase
    .from('payments')
    .update({
      status: 'rejected',
      rejection_reason: reason,
      verified_at: new Date().toISOString(),
      verified_by: user.id,
    })
    .eq('id', paymentId);
  if (error) throw new Error(error.message);

  // Send Email Notification
  const profile = (payment as any)?.student?.profile;
  const courseName = (payment as any)?.enrollment?.course?.name || 'Music Course';
  if (profile?.email) {
    sendPaymentRejectedEmail({
      email: profile.email,
      name: profile.first_name || 'Student',
      courseName,
      reason,
    }).catch(() => {});
  }

  revalidatePath('/admin/payments');
  return { success: true };
}
