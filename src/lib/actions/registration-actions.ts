'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import {
  sendWelcomeEmail,
  sendPaymentSubmittedEmail,
} from '@/lib/email';

export interface RegistrationPayload {
  first_name: string;
  last_name: string;
  middle_name?: string;
  email: string;
  phone: string;
  gender?: string;
  date_of_birth?: string;
  address?: string;
  state?: string;
  country?: string;
  password?: string;
  course_id: string;
  payment_proof_url?: string;
  transaction_reference?: string;
}

async function getAdminSupabase() {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      return createAdminClient();
    } catch {
      // Fallback
    }
  }
  return await createClient();
}

/**
 * Real-time email validation action to check whether an email exists
 * and whether it belongs to an admin, student, or instructor account.
 */
export async function checkEmailAvailabilityAction(email: string) {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return { available: false, message: 'Please enter a valid email address.' };
  }

  const adminDb = await getAdminSupabase();

  const { data: existingProfile } = await adminDb
    .from('profiles')
    .select('id, email, user_type, first_name, last_name')
    .ilike('email', cleanEmail)
    .maybeSingle();

  if (existingProfile) {
    if (existingProfile.user_type === 'admin') {
      return {
        available: false,
        user_type: 'admin',
        message: 'This email address is already registered as an Admin account. Please use a different email for student registration.',
      };
    }
    if (existingProfile.user_type === 'instructor') {
      return {
        available: false,
        user_type: 'instructor',
        message: 'This email address is registered as an Instructor account. Please use a different email address.',
      };
    }
    return {
      available: false,
      user_type: 'student',
      message: `An account with the email address "${cleanEmail}" already exists. Please sign in to your student portal or use another email.`,
    };
  }

  return { available: true, message: 'Email address is available.' };
}

/**
 * Handles complete student registration, email uniqueness check,
 * course enrollment creation, and payment proof submission.
 */
export async function registerStudentAndEnroll(payload: RegistrationPayload) {
  const adminDb = await getAdminSupabase();
  const serverDb = await createClient();

  const cleanEmail = payload.email.trim().toLowerCase();
  const firstName = payload.first_name.trim();
  const lastName = payload.last_name.trim();
  const fullName = payload.middle_name
    ? `${firstName} ${payload.middle_name.trim()} ${lastName}`
    : `${firstName} ${lastName}`;

  if (!cleanEmail || !firstName || !lastName) {
    return { success: false, error: 'First name, last name, and email are required.' };
  }

  if (!payload.course_id) {
    return { success: false, error: 'Please select a program to enroll in.' };
  }

  // 1. Fetch target course
  const { data: course, error: courseError } = await adminDb
    .from('courses')
    .select('id, name, level, price, currency, status')
    .eq('id', payload.course_id)
    .single();

  if (courseError || !course) {
    return { success: false, error: 'Selected program was not found or is currently unavailable.' };
  }

  // 2. Check if user is currently logged in as a student
  const {
    data: { user: currentUser },
  } = await serverDb.auth.getUser();

  let studentId: string | null = null;
  let profileId: string | null = null;

  // 3. Case-insensitive email uniqueness check in profiles table
  const { data: existingProfile } = await adminDb
    .from('profiles')
    .select('id, email, user_type, first_name, last_name')
    .ilike('email', cleanEmail)
    .maybeSingle();

  if (existingProfile) {
    // If the email belongs to an Admin account, STOP and reject explicitly
    if (existingProfile.user_type === 'admin') {
      return {
        success: false,
        error: `The email "${cleanEmail}" belongs to an Admin account. Admins cannot be registered as students using the admin email address. Please use a separate student email.`,
      };
    }

    if (existingProfile.user_type === 'instructor') {
      return {
        success: false,
        error: `The email "${cleanEmail}" belongs to an Instructor account. Please use a separate student email address.`,
      };
    }

    // If the logged-in user matches this profile, reuse their student record
    if (currentUser && currentUser.id === existingProfile.id) {
      profileId = existingProfile.id;
    } else {
      // Otherwise, reject registration with clear error message
      return {
        success: false,
        error: `An account with the email "${cleanEmail}" already exists. Please sign in to your student portal to enroll in new programs, or use another email.`,
      };
    }
  }

  // If no existing profile, create new Auth user & profile
  if (!profileId) {
    if (!payload.password || payload.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    // Create user in Supabase Auth via Admin Client or SignUp
    let newUserId: string | null = null;

    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { data: authData, error: authError } = await adminDb.auth.admin.createUser({
        email: cleanEmail,
        password: payload.password,
        email_confirm: true,
        user_metadata: {
          first_name: firstName,
          last_name: lastName,
          phone: payload.phone?.trim() || '',
          user_type: 'student',
        },
      });

      if (authError) {
        if (authError.message.toLowerCase().includes('already') || authError.status === 422) {
          return {
            success: false,
            error: `An account with the email "${cleanEmail}" already exists. Please sign in or use a different email.`,
          };
        }
        return { success: false, error: authError.message };
      }
      newUserId = authData.user?.id || null;
    }

    if (!newUserId) {
      const { data: authData, error: signUpError } = await serverDb.auth.signUp({
        email: cleanEmail,
        password: payload.password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone: payload.phone?.trim() || '',
            user_type: 'student',
          },
        },
      });

      if (signUpError) {
        const isRateLimit = signUpError.message.toLowerCase().includes('rate limit');
        if (isRateLimit) {
          return {
            success: false,
            error: 'Supabase Auth email rate limit exceeded. Please wait 15–30 minutes before trying again, or configure custom SMTP in Supabase Dashboard.',
          };
        }
        return { success: false, error: signUpError.message };
      }
      newUserId = authData.user?.id || null;
    }

    profileId = newUserId || crypto.randomUUID();

    // Ensure profile exists in profiles table
    const { error: profileError } = await adminDb.from('profiles').upsert({
      id: profileId,
      email: cleanEmail,
      first_name: firstName,
      last_name: lastName,
      phone: payload.phone?.trim() || null,
      user_type: 'student',
      is_active: true,
      updated_at: new Date().toISOString(),
    });

    if (profileError) {
      return { success: false, error: profileError.message };
    }
  }

  // 4. Retrieve or Create student record in students table
  const { data: existingStudent } = await adminDb
    .from('students')
    .select('id')
    .eq('profile_id', profileId)
    .maybeSingle();

  if (existingStudent) {
    studentId = existingStudent.id;
  } else {
    const { data: newStudent, error: studentError } = await adminDb
      .from('students')
      .insert({
        profile_id: profileId,
        gender: payload.gender || null,
        date_of_birth: payload.date_of_birth || null,
        address: payload.address ? `${payload.address.trim()}${payload.state ? ', ' + payload.state.trim() : ''}` : null,
        status: 'pending_enrollment',
      })
      .select('id')
      .single();

    if (studentError || !newStudent) {
      return { success: false, error: studentError?.message || 'Failed to create student profile.' };
    }
    studentId = newStudent.id;
  }

  // 5. Prevent Duplicate Active/Pending Enrollment for the same course
  const { data: existingEnrollment } = await adminDb
    .from('enrollments')
    .select('id, status')
    .eq('student_id', studentId)
    .eq('course_id', course.id)
    .in('status', ['pending', 'active'])
    .maybeSingle();

  if (existingEnrollment) {
    return {
      success: false,
      error: `You are already enrolled (or have a pending registration) for ${course.name}. Please check your student dashboard.`,
    };
  }

  // 6. Create Enrollment Record
  const { data: enrollment, error: enrollError } = await adminDb
    .from('enrollments')
    .insert({
      student_id: studentId,
      course_id: course.id,
      price_at_enrollment: course.price || 0,
      currency: course.currency || 'NGN',
      status: 'pending',
      enrollment_date: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (enrollError || !enrollment) {
    return { success: false, error: enrollError?.message || 'Failed to create course enrollment.' };
  }

  // 7. Create Payment Record with Payment Proof URL
  const { error: paymentError } = await adminDb.from('payments').insert({
    student_id: studentId,
    enrollment_id: enrollment.id,
    amount: course.price || 0,
    currency: course.currency || 'NGN',
    payment_method: 'bank_transfer',
    proof_url: payload.payment_proof_url?.trim() || null,
    transaction_reference: payload.transaction_reference?.trim() || null,
    status: 'pending',
    submitted_at: new Date().toISOString(),
  });

  if (paymentError) {
    return { success: false, error: paymentError.message };
  }

  // 8. Trigger Email Notifications
  sendWelcomeEmail({
    email: cleanEmail,
    name: fullName,
  }).catch(() => {});

  sendPaymentSubmittedEmail({
    email: cleanEmail,
    name: firstName,
    courseName: course.name,
    level: course.level,
    amount: course.price || 0,
  }).catch(() => {});

  revalidatePath('/admin/payments');
  revalidatePath('/admin/enrollments');
  revalidatePath('/student/payments');
  revalidatePath('/student/enrollments');

  return {
    success: true,
    message: `Registration and payment proof for ${course.name} submitted successfully! Your enrollment is currently pending review by THB Academy.`,
  };
}

/**
 * Resubmit payment proof for a rejected payment
 */
export async function resubmitPaymentProofAction(payload: {
  payment_id: string;
  proof_url: string;
  transaction_reference?: string;
}) {
  const adminDb = await getAdminSupabase();

  if (!payload.payment_id || !payload.proof_url) {
    return { success: false, error: 'Payment record ID and payment proof file are required.' };
  }

  // Fetch payment details
  const { data: payment, error: fetchError } = await adminDb
    .from('payments')
    .select(`
      id,
      enrollment_id,
      amount,
      student:students(profile:profiles(first_name, email)),
      enrollment:enrollments(course:courses(name))
    `)
    .eq('id', payload.payment_id)
    .single();

  if (fetchError || !payment) {
    return { success: false, error: 'Payment record not found.' };
  }

  // 1. Update Payment status to pending and clear rejection reason
  const { error: updatePaymentError } = await adminDb
    .from('payments')
    .update({
      proof_url: payload.proof_url,
      transaction_reference: payload.transaction_reference?.trim() || null,
      status: 'pending',
      rejection_reason: null,
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', payload.payment_id);

  if (updatePaymentError) {
    return { success: false, error: updatePaymentError.message };
  }

  // 2. Update Enrollment status back to pending
  if (payment.enrollment_id) {
    await adminDb
      .from('enrollments')
      .update({
        status: 'pending',
        updated_at: new Date().toISOString(),
      })
      .eq('id', payment.enrollment_id);
  }

  // 3. Send Notification Email
  const profile = (payment as any)?.student?.profile;
  const courseName = (payment as any)?.enrollment?.course?.name || 'Music Course';
  if (profile?.email) {
    sendPaymentSubmittedEmail({
      email: profile.email,
      name: profile.first_name || 'Student',
      courseName,
      amount: payment.amount || 0,
    }).catch(() => {});
  }

  revalidatePath('/student/payments');
  revalidatePath('/student/enrollments');
  revalidatePath('/admin/payments');
  revalidatePath('/admin/enrollments');

  return {
    success: true,
    message: 'Payment proof resubmitted successfully! Your payment is now pending review.',
  };
}
